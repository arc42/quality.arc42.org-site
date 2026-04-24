FROM ruby:3.1

WORKDIR /opt/site-deps

RUN gem install bundler:2.3.27

COPY Gemfile ./

RUN bundle _2.3.27_ config set path /usr/local/bundle \
    && bundle _2.3.27_ lock \
    && bundle _2.3.27_ install --jobs 4 --retry 3 \
    && sha256sum Gemfile | awk '{ print $1 }' > /opt/site-deps/.gemfile.sha256

ENV BUNDLE_GEMFILE=/opt/site-deps/Gemfile

COPY _docker/shared/jekyll-entrypoint.sh /usr/local/bin/jekyll-entrypoint

RUN chmod +x /usr/local/bin/jekyll-entrypoint

WORKDIR /site

ENTRYPOINT ["jekyll-entrypoint"]
CMD ["bundle", "exec", "jekyll", "serve", "--incremental", "--watch", "--host", "0.0.0.0", "--force_polling"]
