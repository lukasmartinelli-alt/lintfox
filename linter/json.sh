#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint_source() {
    local repo_path=$(clone_repo)
    local json_files=$(find "$repo_path" -type f -name "*.json")

    for f in $json_files; do
        local lint_output=$(jsonlint "$f")
        echo "$lint_output"
    done

    rm -rf "$repo_path"
}

lint_source
