#!/usr/bin/env bash
# Validate an approach page against the rules in reference/approaches-template.md.
# Usage: validate-approach.sh _approaches/<LETTER>/<slug>.md
# Exit 0 = all checks pass (warnings allowed), exit 1 = at least one error.
set -euo pipefail
FILE=${1:?usage: validate-approach.sh <path-to-approach-md>}
cd "$(git rev-parse --show-toplevel)"
exec python3 - "$FILE" <<'PY'
import glob, os, re, sys

path = sys.argv[1]
src = open(path).read()
m = re.match(r'^---\n(.*?\n)---\n(.*)$', src, re.S)
if not m:
    sys.exit(f"ERROR: {path}: no front-matter block found")
fm, body = m.groups()
errors, warnings = [], []

def arr(name):
    mm = re.search(rf'^{name}: \[(.*?)\]', fm, re.M)
    if mm is None:
        return None
    inner = mm.group(1).strip()
    return [s.strip() for s in inner.split(',')] if inner else []

def notes(name):
    mm = re.search(rf'^{name}:\n((?:  \S.*\n)+)', fm, re.M)
    if mm is None:
        return None
    out = {}
    for line in mm.group(1).splitlines():
        k, _, v = line.strip().partition(':')
        out[k] = v.strip().strip('"')
    return out

def scalar(name):
    mm = re.search(rf'^{name}: (.*)$', fm, re.M)
    return mm.group(1).strip().strip('"') if mm else None

def permalink_slugs(pattern):
    out = set()
    for f in glob.glob(pattern, recursive=True):
        for line in open(f):
            if line.startswith('permalink:'):
                out.add(line.strip().split('/')[-1])
    return out

QUALITIES = permalink_slugs('_qualities/**/*.md')
REQUIREMENTS = permalink_slugs('_requirements/**/*.md')
APPROACH_FILES = {os.path.basename(f)[:-3]: f for f in glob.glob('_approaches/*/*.md')}
DIMENSIONS = {'suitable', 'usable', 'secure', 'reliable', 'operable',
              'efficient', 'flexible', 'safe', 'maintainable'}
slug = os.path.basename(path)[:-3]

# --- front-matter basics
if scalar('layout') != 'approach':
    errors.append("layout must be 'approach'")
if scalar('permalink') != f'/approaches/{slug}':
    errors.append(f"permalink must be /approaches/{slug} (matching the filename)")
letter = os.path.basename(os.path.dirname(path))
if letter != slug[0].upper():
    errors.append(f"file sits in _approaches/{letter}/ but slug starts with '{slug[0].upper()}'")
if slug in QUALITIES or slug in REQUIREMENTS:
    errors.append(f"node-ID collision: '{slug}' already exists as a quality or requirement slug")

tags = arr('tags') or []
if not 1 <= len(tags) <= 3:
    errors.append(f"tags must have 1-3 entries, found {len(tags)}")
for t in set(tags) - DIMENSIONS:
    errors.append(f"tag '{t}' is not one of the 9 dimensions")

# --- slug lists + notes agreement + note budgets
def check_list(name, notes_name, allowed, allowed_label, notes_required, note_budget):
    vals = arr(name)
    nts = notes(notes_name)
    if vals is None:
        if name in ('supported_qualities', 'tradeoffs'):
            errors.append(f"missing required field '{name}'")
        return
    for v in vals:
        if v not in allowed:
            errors.append(f"{name}: '{v}' is not an existing {allowed_label} slug (will be silently dropped)")
    if vals and nts is None and notes_required:
        errors.append(f"'{notes_name}' is required when {name} is non-empty")
    if nts is not None:
        for stray in set(nts) - set(vals):
            errors.append(f"{notes_name}: key '{stray}' has no matching slug in {name} (note renders nowhere)")
        for missing in set(vals) - set(nts):
            errors.append(f"{notes_name}: no note for '{missing}'")
        for k, v in nts.items():
            n = len(v.split())
            if note_budget and n > note_budget:
                errors.append(f"{notes_name}.{k}: {n} words (budget {note_budget})")
            if not note_budget and n > 60:
                warnings.append(f"{notes_name}.{k}: {n} words (~50 is the soft ceiling)")

check_list('supported_qualities', 'supported_qualities_notes', QUALITIES, 'quality', True, 25)
check_list('tradeoffs', 'tradeoff_notes', QUALITIES, 'quality', True, None)
check_list('related_requirements', 'related_requirements_notes', REQUIREMENTS, 'requirement', True, 25)
check_list('related', 'related_notes', set(APPROACH_FILES) - {slug}, 'approach', True, 25)

# one-sided check: counterpart must not declare the relation back
for target in arr('related') or []:
    if target in APPROACH_FILES:
        other = open(APPROACH_FILES[target]).read()
        mm = re.search(r'^related: \[(.*?)\]', other, re.M)
        if mm and slug in [s.strip() for s in mm.group(1).split(',')]:
            errors.append(f"related: '{target}' already declares the relation back to '{slug}' — declare one-sided only")

# aka: no term reused on another approach
for term in arr('aka') or []:
    for other_slug, f in APPROACH_FILES.items():
        if other_slug == slug:
            continue
        mm = re.search(r'^aka: \[(.*?)\]', open(f).read(), re.M)
        if mm and term in [s.strip() for s in mm.group(1).split(',')]:
            errors.append(f"aka: '{term}' is already an alias on '{other_slug}'")

# --- scalar budgets
for name, budget in (('intent', 25), ('mechanism', 50), ('applicability', 50)):
    val = scalar(name)
    if val is None:
        errors.append(f"missing required field '{name}'")
    elif len(val.split()) > budget:
        errors.append(f"{name}: {len(val.split())} words (budget {budget})")

# --- body structure and budget
ALLOWED_HEADINGS = {'How It Works', 'Failure Modes', 'Verification', 'Variants and Related Tactics'}
EXCLUDED_HEADINGS = {'Example', 'Mini Example', 'References'}
content_headings = []
for line in body.splitlines():
    if line.startswith('### '):
        errors.append(f"'###' heading in body: {line.strip()}")
    elif line.startswith('## '):
        h = line[3:].strip()
        if h in EXCLUDED_HEADINGS:
            continue
        content_headings.append(h)
        if h not in ALLOWED_HEADINGS:
            errors.append(f"heading '## {h}' is not in the allowed set")
if len(content_headings) > 4:
    errors.append(f"{len(content_headings)} content headings (max 4)")

counted, skip = [], False
for line in body.splitlines():
    if re.match(r'^## (References|Example|Mini Example)\b', line):
        skip = True
        continue
    if line.startswith('## '):
        skip = False
    if not skip and not line.startswith('!['):
        counted.append(line)
words = len(' '.join(counted).split())
if words > 350:
    errors.append(f"body: {words} words (budget 350, excluding image line / Example / References)")
else:
    print(f"body: {words}/350 words")

for w in warnings:
    print(f"WARN:  {w}")
for e in errors:
    print(f"ERROR: {e}")
print(f"{path}: {'FAIL' if errors else 'PASS'} ({len(errors)} errors, {len(warnings)} warnings)")
sys.exit(1 if errors else 0)
PY
