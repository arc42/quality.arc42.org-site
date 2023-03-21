# jekyll/builder is the official image
FROM jekyll/builder

LABEL version="0.9.0"
LABEL description="develop and generate subdomains of arc42.org site"
LABEL vendor="arc42 (Gernot Starke)"

COPY Gemfile .

#RUN apk update && \
#    apk add ncurses && \
# RUN bundle install
RUN bundle install

WORKDIR /srv/jekyll
EXPOSE 4000
