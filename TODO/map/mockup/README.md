# Quality Map Builder — mockup sources

Four artboards for issue #552, exported from the design canvas
https://claude.ai/artifact/V9hiuaV8tMK2Rvpr3tX1sM (private; ask Gernot for access).

Each `.dc.html` is a self-contained HTML page: open it in a browser. The
`<script src="./support.js">` line is the canvas runtime and 404s harmlessly
outside the canvas.

| File              | Screen                                           |
|-------------------|--------------------------------------------------|
| `Collect.dc.html` | Qualities index with `+ Add` buttons, tray, toast |
| `Detail.dc.html`  | Quality detail page with `Add to selection`      |
| `Main.dc.html`    | `/map/`: canvas, side panel, list twin           |
| `Export.dc.html`  | Export & share: link, Markdown, JSON, image      |

`canvas.json` is the canvas layout index; it has no meaning outside the canvas.
