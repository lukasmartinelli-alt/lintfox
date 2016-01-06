#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

function clone_repo() {
    local working_dir=$(mktemp -dt "lint.XXX")
    local git_output=$(git clone --quiet "$GIT_REPOSITORY" "$working_dir")
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
