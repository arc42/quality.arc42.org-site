import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

const REPORT_WIDTH = 60;
const TEMPLATE_FILES = ["_files-must-have-identical-dates", "_req-template-simple"];
const SEPARATORS = {
  tags: " ",
  related: ",",
};

class LinkValidator {
  constructor(strictMode = false) {
    this.strictMode = strictMode;
    this.qualities = new Map();
    this.requirements = new Map();
    this.standards = new Map();
    this.tagPages = new Set();
    this.errors = [];
  }

  /**
   * Recursively get all markdown files in a directory
   * @param {string} dir - Directory path to search
   * @returns {Promise<string[]>} Array of markdown file paths
   */
  async getMarkdownFiles(dir) {
    const result = [];
    try {
      const files = await fs.readdir(dir);

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(dir, file);
          const stat = await fs.stat(filePath);

          if (stat.isDirectory()) {
            const nestedFiles = await this.getMarkdownFiles(filePath);
            result.push(...nestedFiles);
          } else if (filePath.endsWith(".md")) {
            result.push(filePath);
          }
        }),
      );
    } catch (error) {
      return [];
    }

    return result;
  }

  /**
   * Extract ID from permalink
   * @param {string} permalink - Permalink URL
   * @returns {string|null} Extracted ID or null
   */
  extractId(permalink) {
    if (!permalink) return null;
    return permalink.split("/").pop();
  }

  /**
   * Parse a list from frontmatter
   * @param {string|string[]} value - Value to parse
   * @param {string} separator - Separator character
   * @returns {string[]} Parsed and trimmed array
   */
  parseList(value, separator) {
    if (Array.isArray(value)) {
      return value.map((v) => v.trim()).filter(Boolean);
    }

    return value
      ? value
          .split(separator)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  }

  /**
   * Generic file indexing method
   * @param {string[]} files - Array of file paths
   * @param {Function} extractorFn - Function to extract data from frontmatter
   * @returns {Promise<Map>} Map of indexed items
   */
  async indexFiles(files, extractorFn) {
    const index = new Map();

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      const { data } = matter(content);
      const entry = extractorFn(data, file);

      if (entry && entry.key) {
        index.set(entry.key, entry.value);
      }
    }

    return index;
  }

  /**
   * Build index of all valid targets
   */
  async buildIndex() {
    const projectRoot = process.cwd();
    const qualitiesDir = path.join(projectRoot, "_qualities");
    const requirementsDir = path.join(projectRoot, "_requirements");
    const standardsDir = path.join(projectRoot, "_standards");
    const pagesDir = path.join(projectRoot, "_pages");

    console.log(`${COLORS.cyan}Building index of all content...${COLORS.reset}\n`);

    const [qualityFiles, requirementFiles, standardFiles, pageFiles] = await Promise.all([
      this.getMarkdownFiles(qualitiesDir),
      this.getMarkdownFiles(requirementsDir),
      this.getMarkdownFiles(standardsDir),
      this.getMarkdownFiles(pagesDir),
    ]);

    const isNotTemplate = (f) => !TEMPLATE_FILES.some((template) => f.includes(template));
    const filteredQualityFiles = qualityFiles.filter(isNotTemplate);
    const filteredRequirementFiles = requirementFiles.filter(isNotTemplate);

    [this.qualities, this.requirements, this.standards] = await Promise.all([
      this.indexFiles(filteredQualityFiles, (data, file) => {
        const id = this.extractId(data.permalink);
        if (!id) return null;

        return {
          key: id,
          value: {
            file,
            title: data.title,
            permalink: data.permalink,
            tags: this.parseList(data.tags, SEPARATORS.tags),
            related: this.parseList(data.related, SEPARATORS.related),
            standards: this.parseList(data.standards, SEPARATORS.related),
          },
        };
      }),

      this.indexFiles(filteredRequirementFiles, (data, file) => {
        const id = this.extractId(data.permalink);
        if (!id) return null;

        return {
          key: id,
          value: {
            file,
            title: data.title,
            permalink: data.permalink,
            tags: this.parseList(data.tags, SEPARATORS.tags),
            related: this.parseList(data.related, SEPARATORS.related),
          },
        };
      }),

      this.indexFiles(standardFiles, (data, file) => {
        const standardId = data.standard_id;
        if (!standardId) return null;

        return {
          key: standardId.toLowerCase(),
          value: {
            file,
            title: data.title,
            permalink: data.permalink,
            standardId: data.standard_id,
          },
        };
      }),
    ]);

    for (const file of pageFiles) {
      const filename = path.basename(file);
      if (filename.startsWith("tag-") && filename.endsWith(".md")) {
        const tagName = filename.slice(4, -3);
        this.tagPages.add(tagName);
      }
    }

    console.log(`  ${COLORS.bold}Indexed:${COLORS.reset}`);
    console.log(`    - ${this.qualities.size} qualities`);
    console.log(`    - ${this.requirements.size} requirements`);
    console.log(`    - ${this.standards.size} standards`);
    console.log(`    - ${this.tagPages.size} tag pages\n`);
  }

  /**
   * Validate a list of references against valid targets
   * @param {Object} params - Validation parameters
   * @param {string} params.id - Source item ID
   * @param {string} params.file - Source file path
   * @param {string[]} params.references - Array of references to validate
   * @param {Map|Set} params.validTargets - Valid target IDs
   * @param {string} params.linkType - Type of link (e.g., "quality→quality")
   * @param {string} params.sourceType - Source type for error message
   * @param {Function} [params.messageTemplate] - Custom error message function
   */
  validateReferences({
    id,
    file,
    references,
    validTargets,
    linkType,
    sourceType,
    messageTemplate,
  }) {
    for (const ref of references) {
      const normalizedRef = linkType.includes("standard") ? ref.toLowerCase() : ref;
      const exists = validTargets.has
        ? validTargets.has(normalizedRef)
        : validTargets.get(normalizedRef);

      if (!exists) {
        const defaultMessage = messageTemplate
          ? messageTemplate(id, ref, sourceType)
          : `${sourceType} "${id}" references non-existent ${linkType.split("→")[1]} "${ref}"`;

        this.errors.push({
          type: linkType,
          source: file,
          sourceId: id,
          target: ref,
          message: defaultMessage,
        });
      }
    }
  }

  /**
   * Validate a single quality's links
   * @param {string} id - Quality ID
   * @param {Object} quality - Quality data
   */
  validateQuality(id, quality) {
    const { file, related, tags, standards } = quality;

    // Validate related qualities
    this.validateReferences({
      id,
      file,
      references: related,
      validTargets: this.qualities,
      linkType: "quality→quality",
      sourceType: "Quality",
    });

    // Validate tags
    this.validateReferences({
      id,
      file,
      references: tags,
      validTargets: this.tagPages,
      linkType: "quality→tag",
      sourceType: "Quality",
      messageTemplate: (id, tag) =>
        `Quality "${id}" uses tag "${tag}" but tag page "_pages/tag-${tag}.md" doesn't exist`,
    });

    // Validate standards
    this.validateReferences({
      id,
      file,
      references: standards,
      validTargets: this.standards,
      linkType: "quality→standard",
      sourceType: "Quality",
    });
  }

  /**
   * Validate a single requirement's links
   * @param {string} id - Requirement ID
   * @param {Object} requirement - Requirement data
   */
  validateRequirement(id, requirement) {
    const { file, related, tags } = requirement;

    // Validate related qualities
    this.validateReferences({
      id,
      file,
      references: related,
      validTargets: this.qualities,
      linkType: "requirement→quality",
      sourceType: "Requirement",
    });

    // Validate tags
    this.validateReferences({
      id,
      file,
      references: tags,
      validTargets: this.tagPages,
      linkType: "requirement→tag",
      sourceType: "Requirement",
      messageTemplate: (id, tag) =>
        `Requirement "${id}" uses tag "${tag}" but tag page "_pages/tag-${tag}.md" doesn't exist`,
    });
  }

  /**
   * Validate all links
   */
  async validate() {
    console.log(`${COLORS.cyan}Validating links...${COLORS.reset}\n`);

    for (const [id, quality] of this.qualities) {
      this.validateQuality(id, quality);
    }

    for (const [id, requirement] of this.requirements) {
      this.validateRequirement(id, requirement);
    }
  }

  /**
   * Print validation report
   * @returns {boolean} True if all links are valid
   */
  printReport() {
    const separator = "═".repeat(REPORT_WIDTH);
    const subSeparator = "─".repeat(REPORT_WIDTH);

    console.log(`${COLORS.bold}${separator}${COLORS.reset}`);
    console.log(`${COLORS.bold}  LINK VALIDATION REPORT${COLORS.reset}`);
    console.log(`${COLORS.bold}${separator}${COLORS.reset}\n`);

    if (this.errors.length === 0) {
      console.log(`${COLORS.green}${COLORS.bold}✓ All links are valid!${COLORS.reset}\n`);
      return true;
    }

    // Group errors by type
    const errorsByType = this.errors.reduce((acc, error) => {
      if (!acc[error.type]) acc[error.type] = [];
      acc[error.type].push(error);
      return acc;
    }, {});

    // Print errors grouped by type
    const typeOrder = [
      "quality→quality",
      "quality→tag",
      "quality→standard",
      "requirement→quality",
      "requirement→tag",
    ];

    for (const type of typeOrder) {
      if (errorsByType[type]) {
        console.log(
          `${COLORS.yellow}${COLORS.bold}${type.toUpperCase()} (${errorsByType[type].length} errors)${COLORS.reset}`,
        );
        console.log(`${COLORS.yellow}${subSeparator}${COLORS.reset}`);

        for (const error of errorsByType[type]) {
          const relativePath = error.source.replace(process.cwd() + "/", "");
          console.log(`  ${COLORS.red}✗${COLORS.reset} ${error.message}`);
          console.log(`    ${COLORS.cyan}Source:${COLORS.reset} ${relativePath}`);
          console.log("");
        }
      }
    }

    console.log(`${COLORS.bold}${separator}${COLORS.reset}`);
    console.log(
      `${COLORS.red}${COLORS.bold}Total broken links: ${this.errors.length}${COLORS.reset}\n`,
    );

    return false;
  }

  async run() {
    try {
      await this.buildIndex();
      await this.validate();
      const isValid = this.printReport();

      if (!isValid && this.strictMode) {
        console.log(`${COLORS.red}Exiting with error code 1 (strict mode)${COLORS.reset}\n`);
        process.exit(1);
      } else if (!isValid) {
        console.log(
          `${COLORS.yellow}Warnings only (use --strict to fail the build)${COLORS.reset}\n`,
        );
      }
    } catch (error) {
      console.error(`${COLORS.red}Error during validation:${COLORS.reset}`, error);
      process.exit(1);
    }
  }
}

const strictMode = process.argv.includes("--strict");
const validator = new LinkValidator(strictMode);
validator.run();
