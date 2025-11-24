import fs from 'fs';

const indexData = JSON.parse(fs.readFileSync('quality-index.json', 'utf8'));

// Create a comprehensive summary
const summary = {
  metadata: indexData.metadata,
  statistics: indexData.statistics,

  // Full quality list with abbreviated summaries
  qualitiesIndex: indexData.qualities.map(q => ({
    id: q.id,
    title: q.title,
    tags: q.tags,
    related: q.related,
    standards: q.standards,
    relatedCount: q.related.length,
    tagsCount: q.tags.length,
    standardsCount: q.standards.length,
    contentPreview: q.contentSummary.substring(0, 100) + '...',
    filePath: q.filePath
  })),

  // Sample detailed entries (first 10)
  sampleDetailedEntries: indexData.qualities.slice(0, 10),

  // Analysis insights
  insights: {
    qualitiesWithMostRelations: indexData.qualities
      .sort((a, b) => b.related.length - a.related.length)
      .slice(0, 20)
      .map(q => ({
        id: q.id,
        title: q.title,
        relatedCount: q.related.length,
        related: q.related
      })),

    qualitiesWithMostStandards: indexData.qualities
      .sort((a, b) => b.standards.length - a.standards.length)
      .slice(0, 20)
      .map(q => ({
        id: q.id,
        title: q.title,
        standardsCount: q.standards.length,
        standards: q.standards
      })),

    qualitiesByTag: {},
    qualitiesByStandard: {}
  }
};

// Group qualities by tag
const tagGroups = {};
indexData.qualities.forEach(q => {
  q.tags.forEach(tag => {
    if (!tagGroups[tag]) tagGroups[tag] = [];
    tagGroups[tag].push(q.id);
  });
});
summary.insights.qualitiesByTag = tagGroups;

// Group qualities by standard
const standardGroups = {};
indexData.qualities.forEach(q => {
  q.standards.forEach(std => {
    if (!standardGroups[std]) standardGroups[std] = [];
    standardGroups[std].push(q.id);
  });
});
summary.insights.qualitiesByStandard = standardGroups;

// Write summary
fs.writeFileSync('quality-index-summary.json', JSON.stringify(summary, null, 2));
console.log('\n✓ Summary created: quality-index-summary.json');
console.log(`\n=== KEY INSIGHTS ===`);
console.log(`\nTotal qualities indexed: ${summary.qualitiesIndex.length}`);
console.log(`Total unique tags: ${Object.keys(tagGroups).length}`);
console.log(`Total unique standards: ${Object.keys(standardGroups).length}`);
console.log(`\nRelation distribution:`);
console.log(`  - Min relations: ${Math.min(...indexData.qualities.map(q => q.related.length))}`);
console.log(`  - Max relations: ${Math.max(...indexData.qualities.map(q => q.related.length))}`);
console.log(`  - Average relations: ${summary.statistics.averageRelationsPerQuality.toFixed(2)}`);
console.log(`\nTag distribution:`);
console.log(`  - Min tags per quality: ${Math.min(...indexData.qualities.map(q => q.tags.length))}`);
console.log(`  - Max tags per quality: ${Math.max(...indexData.qualities.map(q => q.tags.length))}`);
console.log(`  - Average tags: ${(indexData.qualities.reduce((sum, q) => sum + q.tags.length, 0) / indexData.qualities.length).toFixed(2)}`);
console.log(`\nStandard distribution:`);
console.log(`  - Min standards per quality: ${Math.min(...indexData.qualities.map(q => q.standards.length))}`);
console.log(`  - Max standards per quality: ${Math.max(...indexData.qualities.map(q => q.standards.length))}`);
console.log(`  - Average standards: ${(indexData.qualities.reduce((sum, q) => sum + q.standards.length, 0) / indexData.qualities.length).toFixed(2)}`);
console.log(`  - Qualities with no standards: ${indexData.qualities.filter(q => q.standards.length === 0).length}`);
