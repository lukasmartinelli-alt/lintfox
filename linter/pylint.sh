#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint() {
    local repo_path=$(clone_repo)
    for f in $(find_files "$repo_path" "py"); do
        pylint -f parseable "$f" || suppress_lint_error
    done
    trap "rm -rf $repo_path" EXIT
}

lint
