import { QUALITY_FILL, itemStyle } from "../nodeStyle.js";

// Image export of the map canvas: the live <svg> becomes a standalone SVG string
// (styles inlined, legend added), which can also be rasterised to PNG.
//
// Geometry: the export is the UNTRANSFORMED layout. The zoom/pan transform is
// dropped from the clone; the viewBox is the bounding box of the drawn content
// (getBBox on the live zoom group, since clones have no layout) plus padding,
// with a legend strip below it.

const SVG_NS = "http://www.w3.org/2000/svg";
const FALLBACK_FONT = "sans-serif";
const LEGEND_WIDTH = 330;
const LEGEND_GAP = 16;
const ROW_HEIGHT = 20;
const LEGEND_INK = "#333333";

const TEXT_PROPS = ["font-family", "font-size", "font-weight", "text-anchor", "fill"];
const SHAPE_PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray"];
const INLINED = { text: TEXT_PROPS, circle: SHAPE_PROPS, rect: SHAPE_PROPS, line: SHAPE_PROPS };

const DROP_ATTR = /^(class|tabindex|data-.*|aria-.*)$/;

function inlineStyles(live, clone) {
  const view = live.ownerDocument.defaultView;
  const liveEls = [...live.querySelectorAll("text, circle, rect, line")];
  const cloneEls = [...clone.querySelectorAll("text, circle, rect, line")];
  liveEls.forEach((el, i) => {
    const computed = view.getComputedStyle(el);
    for (const prop of INLINED[el.localName]) {
      let value = computed.getPropertyValue(prop);
      if (prop === "font-family" && !/sans-serif/i.test(value)) {
        value = `${value}, ${FALLBACK_FONT}`;
      }
      if (value) cloneEls[i].setAttribute(prop, value);
    }
  });
}

function stripAttributes(root) {
  for (const el of [root, ...root.querySelectorAll("*")]) {
    for (const { name } of [...el.attributes]) if (DROP_ATTR.test(name)) el.removeAttribute(name);
  }
}

function node(doc, tag, attrs, text) {
  const el = doc.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  if (text !== undefined) el.textContent = text;
  return el;
}

/** Legend group at (x, y), built from the nodeStyle constants. Returns it with its height. */
function buildLegend(doc, x, y) {
  const g = node(doc, "g", { transform: `translate(${x},${y})`, "font-family": FALLBACK_FONT });
  const label = (lx, ly, text, bold = false) =>
    g.append(
      node(
        doc,
        "text",
        { x: lx, y: ly, "font-size": 12, fill: LEGEND_INK, ...(bold && { "font-weight": 700 }) },
        text,
      ),
    );
  label(0, 12, "How to read", true);
  label(0, 12 + ROW_HEIGHT, "Size and fill show my priority.");
  let cx = 0;
  const swatchY = 12 + ROW_HEIGHT * 2;
  for (const [key, text] of [
    ["none", "none"],
    ["medium", "med"],
    ["high", "high"],
  ]) {
    g.append(
      node(doc, "circle", {
        cx: cx + 7,
        cy: swatchY - 4,
        r: 7,
        fill: QUALITY_FILL[key],
        stroke: QUALITY_FILL.high,
        "stroke-width": 2,
      }),
    );
    label(cx + 18, swatchY, text);
    cx += 70;
  }
  const rows = [
    ["approach", "approach · number = qualities served"],
    ["custom", "your own requirement"],
  ];
  rows.forEach(([type, text], i) => {
    const style = itemStyle(type);
    const ry = swatchY + ROW_HEIGHT * (i + 1);
    g.append(
      node(doc, "rect", {
        x: 0,
        y: ry - 11,
        width: 22,
        height: 14,
        rx: style.dashed ? 3 : 7,
        fill: style.fill,
        stroke: style.stroke,
        "stroke-width": 2,
        ...(style.dashed && { "stroke-dasharray": "4 3" }),
      }),
    );
    label(30, ry, text);
  });
  return { g, height: swatchY + ROW_HEIGHT * rows.length + 4 };
}

/**
 * Standalone SVG text of the map: untransformed layout, styles inlined as
 * attributes (no classes), background rect, optional legend, xmlns, XML declaration.
 */
export function serializeMapSvg(
  svgEl,
  { legend = true, background = "#ffffff", padding = 24 } = {},
) {
  const doc = svgEl.ownerDocument;
  const liveZoom = svgEl.querySelector(".map-zoom");
  const box = liveZoom.getBBox();
  const clone = svgEl.cloneNode(true);
  inlineStyles(svgEl, clone);
  clone.querySelector(".map-zoom").removeAttribute("transform");
  stripAttributes(clone);

  const width = Math.ceil(
    Math.max(box.width + 2 * padding, legend ? LEGEND_WIDTH + 2 * padding : 0),
  );
  const x = box.x - padding;
  const y = box.y - padding;
  let height = Math.ceil(box.height + 2 * padding);
  let legendGroup = null;
  if (legend) {
    const built = buildLegend(doc, x + padding, y + height - padding + LEGEND_GAP);
    legendGroup = built.g;
    height = Math.ceil(height - padding + LEGEND_GAP + built.height + padding);
  }

  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);
  clone.removeAttribute("style");
  clone.prepend(node(doc, "rect", { x, y, width, height, fill: background }));
  if (legendGroup) clone.append(legendGroup);

  const xml = new doc.defaultView.XMLSerializer().serializeToString(clone);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

/** Rasterise an SVG string (as made by serializeMapSvg) to a PNG Blob. */
export async function svgToPngBlob(svgString, { scale = 2, doc = globalThis.document } = {}) {
  const url = URL.createObjectURL(new Blob([svgString], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("PNG export failed"));
      img.src = url;
    });
    const canvas = doc.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("PNG export failed");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
