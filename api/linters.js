'use strict';
var path = require('path');
var Q = require('q');
var exec = Q.denodeify(require('child_process').exec);
var execFile = Q.denodeify(require('child_process').execFile);
var execFileOldschool = require('child_process').execFile;
var rmdir = Q.denodeify(require('rimraf'));
var temp = require('temp');
var mkdtemp = Q.denodeify(temp.mkdir);

// Automatically track and cleanup files at exit
temp.track();

function clone(dirPath, repoUrl) {
    console.log('Cloning ' + repoUrl + ' to ' + path.resolve(dirPath));
    return execFile('git', ['clone', '-q', repoUrl, dirPath]).then(function() {
        return dirPath;
    });
}

function findDefaultBranch(repoPath) {
    console.log('Looking for default branch' + repoPath);
    var options = { cwd: repoPath };
    var cmd = 'git rev-parse --abbrev-ref HEAD';
    return exec(cmd, options).then(function(stdout) {
        return stdout[0].trim();
    }, function(err) {
        console.error(err);
        return 'master';
    });
}

function pep8(repoPath) {
    var deferred = Q.defer();
    var format = '%(path)s|%(row)d|%(col)d|%(code)s|%(text)s';
    execFileOldschool('pep8', ['--format', format, repoPath], { cwd: repoPath }, function(err, stdout, stderr) {
        var lines = stdout.split("\n");
        deferred.resolve(lines.map(function(val) {
            var tokens = val.split("|");
            return {
                path: tokens[0],
                row: tokens[1],
                col: tokens[2],
                code: tokens[3],
                text: tokens[4]
            }
        }));
    });
    return deferred.promise;
}

function rubocop(repoPath) {
    var deferred = Q.defer();
    execFileOldschool('rubocop', ['--lint', '--format', 'json', repoPath], { cwd: repoPath }, function(err, stdout, stderr) {
        deferred.resolve(JSON.parse(stdout));
    });
    return deferred.promise;
}

function rubylint(repoPath) {
    var deferred = Q.defer();
    execFileOldschool('ruby-lint', ['--presenter', 'json', repoPath], { cwd: repoPath }, function(err, stdout, stderr) {
        deferred.resolve(JSON.parse(stdout));
    });
    return deferred.promise;
}

module.exports = function lint(repoUrl) {
    return mkdtemp('lintfox').then(function(dirPath) {
        return clone(dirPath, repoUrl).then(function(repoPath) {
            console.log("Cloned repo to " + repoPath);
            return findDefaultBranch(repoPath).then(function(defaultBranch) {
                console.log('Default branch is ' + defaultBranch);
                return Q.all([
                    pep8(repoPath),
                    rubocop(repoPath),
                    rubylint(repoPath),
                ]).then(function(results) {
                    return {
                        pep8: results[0],
                        rubocop: results[1],
                        rubylint: results[2],
                    };
                }, function(err) {
                    console.error(err);
                });
            });
        })
        .fin(function() {
            console.log('Cleaning up ' + dirPath);
            rmdir(dirPath);
        });
    });
};
