#! /usr/bin/env sh

command="${1}"
shift

printUsage() {
  printf "./run <command>\\n\\n"
  echo   "where <command> is one of:"
  echo   "  lint"
  printf "  test\\n\\n"
}

case "${command}" in
  test)
    npx nyc mocha --ui tdd "$@" -- 'tests/**/*.js' ;;

  lint)
    npx eslint lib tests ;;

  '')
    printf "'run' requires a command\\n\\n"
    printUsage ;;

  *)
    printf "command '%s' not valid\\n\\n" "${command}"
    printUsage ;;
esac
