FROM ruby:3.1.7-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs git \
    && gem install bundler:2.3.27 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site
