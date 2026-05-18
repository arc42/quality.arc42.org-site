## Tooling and Build {#tooling} 

- This page is based upon [Jekyll](https://jekyllrb.com), a static website generator. 
- It's maintained on [Github](https://github.com/arc42/quality.arc42.org-site/) and published via github-pages. 
- A custom Docker Compose environment handles dependency installation, graph data generation, JavaScript bundling (esbuild), and Jekyll serving — no manual toolchain wiring needed.
- In case you want to run the site locally, use `docker compose up` after cloning the repo locally.
- The site's UI is a bespoke design, crafted to reflect the arc42 brand: a violet/teal palette, accessibility-first typography, and an interactive D3.js force graph as the visual centrepiece.
 
- build_revision: {{ site.github.build_revision }}, 
- last built and published on {{ site.time | date: '%c' }}


