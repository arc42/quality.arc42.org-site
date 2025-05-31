# arc42 Quality model

Here we collect definitions of quality attributes and their relationships .

It's powered by Jekyll and a modified TTSCK theme (see below).

## License

As all of the arc42 content, this FAQ is free to use under a liberal Creative-Commons
license:

![](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)
This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

## Jekyll TTSCK Theme

For documentation on this theme, see the [original documentation](https://ttskch.github.io/jekyll-ttskch-theme/).

We implemented several enhancements over the original theme (e.g. responsive navigation, thx to Falk Hoppe)

## How to build & run

### Preconditions

You have an environment that allows to run

- a bash script (`/bin/bash`)
- [docker](https://docs.docker.com/build/building/context/) and [docker-compose](https://docs.docker.com/compose/)

### Build and test

In the root directory, run `docker compose up`.

## How to contribute

Create a fork of [https://github.com/arc42/quality.arc42.org-site](https://github.com/arc42/quality.arc42.org-site). Change files and create a pull request with your changes using your fork.

Hint: `_todo-qualities` contains qualities whose definitions are missing. You may fill those files with content. Then move them to the appropriate folder (e.g. `qualities/<letter>/_posts`).

Hint: If you add new files you have to clean-rebuild the whole application.
