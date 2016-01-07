'use strict';
var Q = require('q');
var rp = require('request-promise');

function nigit(program, repo) {
    return {
        uri: 'http://linter/' + program + '?git_repository=' + repo,
        json: true,
        headers: {
            'Accept': 'application/json'
        }
    };
}

function gitCommits(repo) {
    return rp(nigit('git', repo));
}

function pep8(repo) {
    return rp(nigit('pep8', repo)).then(function(data) {
        var lines = data.split("\n");
        return lines.map(function(val) {
            var tokens = val.split("|");
            return {
                path: tokens[0],
                row: tokens[1],
                col: tokens[2],
                code: tokens[3],
                text: tokens[4]
            }
        });
    }); 
}

module.exports = {
    gitCommits: gitCommits,
    pep8: pep8
}
