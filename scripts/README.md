# ISO/IEC 5055 Reference Validation

This directory contains a validation script for checking the reference URLs in the ISO/IEC 5055 standard.

## Usage

Run the validation script when network access is available:

```bash
./scripts/validate_iso5055_references.sh
```

## Output

The script generates a markdown table showing:
- Reference URL
- HTTP Status Code  
- Result (OK, Redirect, Error, etc.)
- Final URL (after redirects)

## Example Output

```
| Reference URL | Status Code | Result | Final URL |
|:--- |:--- |:--- |:--- |
| https://webstore.ansi.org/standards/iso/isoiec50552021 | 200 | ✅ OK | https://webstore.ansi.org/standards/iso/isoiec50552021 |
| https://www.omg.org/spec/ASCQM/1.1/PDF | 200 | ✅ OK | https://www.omg.org/spec/ASCQM/1.1/PDF |
```

## Integration

This validation could be integrated into CI/CD pipelines to automatically check reference validity on a regular basis.