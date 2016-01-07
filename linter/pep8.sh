#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh
readonly FORMAT='%(path)s|%(row)d|%(col)d|%(code)s|%(text)s'

function lint() {
    local repo_path=$(clone_repo)
    pep8 --format "$FORMAT" "$repo_path" || suppress_lint_error
    trap "rm -rf $repo_path" EXIT
}

lint
