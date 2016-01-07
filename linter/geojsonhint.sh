#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function lint_files() {
    local repo_path="$1"
    for f in $(find_files "$repo_path" "geojson"); do
        geojsonhint --json "$f" || suppress_lint_error
        echo ","
    done
}

function output_as_json() {
    local repo_path=$(clone_repo)
    local lint_output=$(lint_files "$repo_path")
    echo "[${lint_output::-1}]"
    trap "rm -rf $repo_path" EXIT
}

output_as_json
