#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

source utils.sh

function git_log() {
    local repo_path=$(clone_repo)
    local format='{%n  "commit": "%H",%n  "author": "%an <%ae>",%n  "date": "%ad",%n  "message": "%f"%n},'
    (cd "$repo_path" && git log \
        --pretty=format:"$format" \
        $@ | \
        perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
        perl -pe 's/},]/}]/'
    )
}

git_log
