#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint_source() {
    local repo_path=$(clone_repo)
    local lint_output=$(hlint "$repo_path")
    echo "$lint_output"

    rm -rf "$repo_path"
}

lint_source
