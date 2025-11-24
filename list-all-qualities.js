import fs from 'fs';

const data = JSON.parse(fs.readFileSync('quality-index.json', 'utf8'));

console.log('=== ALL 180 QUALITIES INDEXED ===\n');

// Group by first letter
const byLetter = {};
data.qualities.forEach(q => {
  const letter = q.id[0].toUpperCase();
  if (!byLetter[letter]) byLetter[letter] = [];
  byLetter[letter].push(q);
});

Object.keys(byLetter).sort().forEach(letter => {
  console.log(`\n--- ${letter} (${byLetter[letter].length} qualities) ---`);
  byLetter[letter].forEach(q => {
    const tags = q.tags.join(', ');
    const relCount = q.related.length;
    const stdCount = q.standards.length;
    console.log(`  ${q.id.padEnd(35)} | Tags: ${tags.substring(0, 30).padEnd(30)} | Rel: ${String(relCount).padStart(2)} | Std: ${String(stdCount).padStart(2)}`);
  });
});

console.log(`\n\n=== SUMMARY ===`);
console.log(`Total: ${data.qualities.length} qualities`);
console.log(`Letters covered: ${Object.keys(byLetter).length}`);

// Write compact JSON
const compactList = data.qualities.map(q => ({
  id: q.id,
  title: q.title,
  tags: q.tags,
  relatedCount: q.related.length,
  standardsCount: q.standards.length,
  filePath: q.filePath
}));

fs.writeFileSync('all-qualities-compact.json', JSON.stringify(compactList, null, 2));
console.log('\n✓ Compact list saved to: all-qualities-compact.json');
