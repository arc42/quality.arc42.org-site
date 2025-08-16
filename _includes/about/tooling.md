## Tooling and Build {#tooling} 

- This page is based upon [Jekyll](https://jekyllrb.com), a static website generator. 
- It uses a modified and modernized version of the [Ttskch](https://github.com/ttskch/jekyll-ttskch-theme) theme. 
- It's maintained on [Github](https://github.com/arc42/quality.arc42.org-site/) and published via github-pages. 
- A [Docker container](https://github.com/BretFisher/jekyll-serve) provided by Bret E. Fisher for local build- and test of the site.
- In case you want to run the site locally, use `docker compose up` after cloning the repo locally. 
 
- build_revision: {{ site.github.build_revision }}, 
- last built and published on {{ site.time | date: '%c' }}


