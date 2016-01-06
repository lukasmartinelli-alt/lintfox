#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint_source() {
    local repo_path=$(clone_repo)
    local shell_files=$(find "$repo_path" -type f -name "*sh")

    for f in $shell_files; do
        local lint_output=$(shellcheck "$f")
        echo "$lint_output"
    done

    rm -rf "$repo_path"
}

lint_source
