FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /tmp/deps

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund \
    && mkdir -p /opt/site-deps \
    && cp -a node_modules /opt/site-deps/node_modules \
    && sha256sum package-lock.json | awk '{ print $1 }' > /opt/site-deps/.package-lock.sha256 \
    && npm cache clean --force \
    && mkdir -p /site/node_modules

COPY _docker/shared/node-entrypoint.sh /usr/local/bin/node-entrypoint

RUN chmod +x /usr/local/bin/node-entrypoint

WORKDIR /site

ENTRYPOINT ["node-entrypoint"]
CMD ["npx", "playwright", "test", "--config", "_docker/playwright/playwright.config.ts"]
