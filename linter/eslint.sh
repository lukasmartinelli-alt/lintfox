#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint() {
    local repo_path=$(clone_repo)
    eslint "$repo_path" || suppress_lint_error
    trap "rm -rf $repo_path" EXIT
}

lint
