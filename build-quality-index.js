import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUALITIES_DIR = path.join(__dirname, '_qualities');

/**
 * Parse tags/related/standards from frontmatter
 * Handles both array and string formats
 */
function parseArrayField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    // Handle comma-separated or space-separated
    return field.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Extract content summary from markdown content
 * Get first 200-300 words or all definition sections
 */
function extractContentSummary(content) {
  // Remove HTML comments
  let cleaned = content.replace(/<!--[\s\S]*?-->/g, '');

  // Remove HTML tags but keep content
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // Remove multiple spaces and newlines
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Get first 300 words
  const words = cleaned.split(/\s+/);
  const summary = words.slice(0, 300).join(' ');

  return summary + (words.length > 300 ? '...' : '');
}

/**
 * Extract permalink ID (last segment)
 */
function extractId(permalink) {
  if (!permalink) return null;
  const segments = permalink.split('/').filter(Boolean);
  return segments[segments.length - 1];
}

/**
 * Recursively find all .md files in a directory
 */
function findMarkdownFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Process a single quality file
 */
function processQualityFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(content);

  // Skip template files
  if (markdown.includes('_files-must-have-identical-dates')) {
    return null;
  }

  const id = extractId(frontmatter.permalink);

  return {
    id,
    title: frontmatter.title || '',
    tags: parseArrayField(frontmatter.tags),
    related: parseArrayField(frontmatter.related),
    standards: parseArrayField(frontmatter.standards),
    contentSummary: extractContentSummary(markdown),
    filePath: filePath.replace(__dirname + '/', ''),
    permalink: frontmatter.permalink || ''
  };
}

/**
 * Calculate statistics from the index
 */
function calculateStatistics(qualities) {
  const stats = {
    totalQualities: qualities.length,
    withZeroRelations: 0,
    withMoreThan10Relations: 0,
    totalRelations: 0,
    tagFrequency: {},
    standardFrequency: {},
    relatedFrequency: {}
  };

  for (const quality of qualities) {
    const relationCount = quality.related.length;
    stats.totalRelations += relationCount;

    if (relationCount === 0) {
      stats.withZeroRelations++;
    }
    if (relationCount > 10) {
      stats.withMoreThan10Relations++;
    }

    // Count tag frequency
    for (const tag of quality.tags) {
      stats.tagFrequency[tag] = (stats.tagFrequency[tag] || 0) + 1;
    }

    // Count standard frequency
    for (const standard of quality.standards) {
      stats.standardFrequency[standard] = (stats.standardFrequency[standard] || 0) + 1;
    }

    // Count related frequency (how many times a quality is referenced)
    for (const rel of quality.related) {
      stats.relatedFrequency[rel] = (stats.relatedFrequency[rel] || 0) + 1;
    }
  }

  stats.averageRelationsPerQuality = stats.totalRelations / stats.totalQualities;

  // Sort frequencies
  stats.topTags = Object.entries(stats.tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag, count]) => ({ tag, count }));

  stats.topStandards = Object.entries(stats.standardFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([standard, count]) => ({ standard, count }));

  stats.mostReferencedQualities = Object.entries(stats.relatedFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([quality, count]) => ({ quality, count }));

  return stats;
}

/**
 * Main function
 */
function buildQualityIndex() {
  console.log('Building quality index...\n');

  // Find all quality files
  const files = findMarkdownFiles(QUALITIES_DIR);
  console.log(`Found ${files.length} quality files`);

  // Process each file
  const qualities = [];
  let skipped = 0;

  for (const file of files) {
    const quality = processQualityFile(file);
    if (quality) {
      qualities.push(quality);
    } else {
      skipped++;
    }
  }

  console.log(`Processed ${qualities.length} qualities`);
  console.log(`Skipped ${skipped} template files\n`);

  // Sort by ID
  qualities.sort((a, b) => a.id.localeCompare(b.id));

  // Calculate statistics
  const stats = calculateStatistics(qualities);

  // Build output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      processedQualities: qualities.length,
      skippedTemplates: skipped
    },
    statistics: stats,
    qualities: qualities
  };

  // Write to file
  const outputPath = path.join(__dirname, 'quality-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Quality index written to: quality-index.json`);

  // Print summary statistics
  console.log('\n=== STATISTICS ===\n');
  console.log(`Total Qualities: ${stats.totalQualities}`);
  console.log(`Average Relations per Quality: ${stats.averageRelationsPerQuality.toFixed(2)}`);
  console.log(`Qualities with 0 relations: ${stats.withZeroRelations}`);
  console.log(`Qualities with >10 relations: ${stats.withMoreThan10Relations}`);

  console.log(`\n--- Top 15 Tags ---`);
  stats.topTags.forEach(({ tag, count }) => {
    console.log(`  ${tag}: ${count}`);
  });

  console.log(`\n--- Top 15 Standards ---`);
  stats.topStandards.forEach(({ standard, count }) => {
    console.log(`  ${standard}: ${count}`);
  });

  console.log(`\n--- Top 20 Most Referenced Qualities ---`);
  stats.mostReferencedQualities.forEach(({ quality, count }) => {
    console.log(`  ${quality}: ${count}`);
  });

  return output;
}

// Run the script
buildQualityIndex();
