

## Instructions

I have already described several quality standards (e.g., ISO 25010, ISO 26262, ISO 27001). Please help me to also cover **{{standard_name}}**.

The existing file `_standards/{{standard_filename}}.md` is just a placeholder and might contain erroneous information. Please thoroughly search the web for reliable and accurate sources and summarize them into a concise, one-page overview (similar in structure and tone to the existing standard pages).

In addition, please provide a list of quality attributes that are addressed (directly or indirectly) by the **{{standard_name}}** standard. Put these names into a new file named `_todo/{{attributes_filename}}.md`.

**Workflow:**

1.  **Review Existing Content:** First, carefully review the existing `_standards/iso-25010.md` file to understand and mirror its structure, tone, and level of detail for the new page.
2.  **Research:** Fetch authoritative and trustworthy sources about **{{standard_name}}** from the web.
3.  **Synthesize and Write:** Synthesize the gathered information into a concise one-page overview and update the existing `_standards/{{standard_filename}}.md` file accordingly.
4.  **Extract Attributes:** Create the `_todo/{{attributes_filename}}.md` file containing the list of quality attributes.

Think hard—the correctness of all facts and links provided is crucial and highly important. Ask for clarification if you need additional information.

---

## Suggestions for Improvement

Here are a few suggestions to improve this prompt for future use. I've added them to this generic version to help generate better and more consistent results.

### 1. Provide Multiple Examples for Context

Instead of only referring to `iso-25010.md`, it would be beneficial to provide a list of 2-3 existing, high-quality standard pages.

**Why:** Providing more examples gives the model a better understanding of the desired style, structure, and depth. It helps create a more consistent result that aligns better with the existing content, reducing the need for manual edits.

**Example modification:**
"First, carefully review existing pages like `_standards/iso-25010.md` and `_standards/iso-26262.md` to understand and mirror their structure..."

### 2. Request Structured Data for Quality Attributes

Instead of a plain text list, ask for the quality attributes in a structured format like YAML or JSON.

**Why:** Structured data is machine-readable, making it much easier to process the output automatically. For example, you could use a script to update your site's data files without manual copy-pasting. This also forces a clearer distinction between direct and indirect relationships.

**Example modification:**
"In addition, provide a list of quality attributes... in YAML format. For each attribute, specify if the relationship is 'direct' or 'indirect'. Save this to `_todo/{{attributes_filename}}.yaml`."

*Example Output (`{{attributes_filename}}.yaml`):*
```yaml
standard: {{standard_name}}
qualities:
  - name: Maintainability
    relation: direct
  - name: Security
    relation: indirect
  - name: Reliability
    relation: direct
```

### 3. Require Source Attribution

Explicitly ask the model to list the URLs of the primary sources it used to generate the content.

**Why:** The prompt emphasizes the importance of correctness. Requiring sources makes the information verifiable and transparent. It allows you to quickly check the accuracy of the generated text and ensures that the information comes from reputable domains (e.g., official standards bodies, well-known industry experts).

**Example modification:**
"At the end of the updated `_standards/{{standard_filename}}.md` file, add a 'Sources' section listing the URLs of the authoritative web pages you used for your summary."
