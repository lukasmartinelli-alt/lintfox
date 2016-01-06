#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint() {
    local repo_path=$(clone_repo)
    puppet-lint "$repo_path" || suppress_lint_error
    trap "rm -rf $repo_path" EXIT
}

lint
