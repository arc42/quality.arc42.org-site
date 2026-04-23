FROM node:22.13.1-bookworm-slim

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
CMD ["npm", "run", "watch"]
