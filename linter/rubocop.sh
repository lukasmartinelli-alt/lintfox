#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh


function lint_source() {
    local repo_path=$(clone_repo)
    rubocop --lint --format json "$repo_path" || suppress_lint_error
}

lint_source
