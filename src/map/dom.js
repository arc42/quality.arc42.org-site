// Tiny DOM helper shared by the map views. Text goes in via textContent only.

/** Create `<tag>` in `doc` with an optional class, text and attributes. */
export function el(doc, tag, { className, text, attrs } = {}) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attrs ?? {})) node.setAttribute(name, value);
  return node;
}
