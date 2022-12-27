FROM jekyll/builder

LABEL version="0.8.6"
LABEL description="develop and generate quality.arc42.org site"
LABEL vendor="arc42 (Gernot Starke)"

COPY Gemfile .

RUN apk update && \
    apk add ncurses && \
    bundle install

WORKDIR /srv/jekyll
EXPOSE 4000
