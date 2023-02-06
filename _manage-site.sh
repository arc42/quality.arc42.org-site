#! /bin/bash
#
# helper, so you don't need to remember docker-compose syntax...

# what's the site?
site="qualities.arc42.org"

remotedir="."

# some colors to highlight certain output
GREEN=`tput setaf 2`
RED=`tput setaf 5`
BLUE=`tput setaf 6`
RESET=`tput sgr0`

clear

echo
echo "Docker container to develop or build the ${BLUE}$site ${RESET}website:"
echo "============================================================"
echo
echo "Please select wether to ${GREEN}develop ${RESET} or ${RED} build ${RESET} the site:"
echo
echo "${GREEN}(c)lean ${RESET} _site directory"
echo
echo "${GREEN}(d)evelop ${RESET} starts a jekyll server on port 0.0.0.0:4000, with incremental build and change listener."
echo
echo "${GREEN}(b)build ${RESET} build the required docker image."
echo
echo "${GREEN}(r)emove ${RESET} the running docker container."
echo
echo "=================================================="
echo

read -p "Enter your selection (default: develop, d) : " choice


if [[ -z $choice ]]; then
    choice='develop'
fi

case "$choice" in
  b|B|build) echo "build Docker image"
        docker-compose --file _docker-compose-dev.yml build --force-rm
        ;;

  c|C|clean) echo "clean _site directory"
        rm -r _site
        ;;

  d|D|dev|develop) echo "develop, incremental build"
        rm -r _site
        docker-compose --file _docker-compose-dev.yml up
        ;;

  r|R|remove) echo "remove running docker container"
        docker-compose --file _docker-compose-dev.yml down
        ;;

  


  # catchall: abort
  *)               echo "${RED} unknown option $choice ${RESET}, aborted."
                   exit 1
                   ;;
esac

echo "Thanx."
