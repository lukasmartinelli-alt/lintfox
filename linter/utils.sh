#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

readonly GIT_COMMIT=${GIT_COMMIT:-}

function clone_repo() {
    local working_dir=$(mktemp -dt "lint.XXX")
    local git_output=$(git clone --quiet "$GIT_REPOSITORY" "$working_dir")

    if [ ! -z "$GIT_COMMIT" ]; then
        (cd "$working_dir" && git checkout "$GIT_COMMIT" > /dev/null 2>&1)
    fi

    echo "$working_dir"
}

function suppress_lint_error() {
    local _="$?"
}

function find_files() {
    local path="$1"
    local extension="$2"
    find "$path" -type f -name "*$extension"
}
