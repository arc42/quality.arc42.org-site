FROM ruby:3.1

WORKDIR /tmp/bundle

RUN gem install bundler:2.3.27

COPY Gemfile Gemfile.lock ./

RUN bundle _2.3.27_ config set frozen true \
    && bundle _2.3.27_ config set path /usr/local/bundle \
    && bundle _2.3.27_ install --jobs 4 --retry 3 \
    && mkdir -p /opt/site-deps \
    && sha256sum Gemfile.lock | awk '{ print $1 }' > /opt/site-deps/.gemfile-lock.sha256

COPY _docker/shared/jekyll-entrypoint.sh /usr/local/bin/jekyll-entrypoint

RUN chmod +x /usr/local/bin/jekyll-entrypoint

WORKDIR /site

ENTRYPOINT ["jekyll-entrypoint"]
CMD ["bundle", "exec", "jekyll", "serve", "--incremental", "--watch", "--host", "0.0.0.0", "--force_polling"]
