'use strict';
var path = require('path');
var Q = require('q');
var exec = Q.denodeify(require('child_process').exec);
var execFile = Q.denodeify(require('child_process').execFile);
var execFileOldschool = require('child_process').execFile;
var rmdir = Q.denodeify(require('rimraf'));
var temp = require('temp');
var mkdtemp = Q.denodeify(temp.mkdir);
var glob = Q.denodeify(require("glob"));
var path = require('path');

// Automatically track and cleanup files at exit
temp.track();

function execFileAlways(program, args) {
    var deferred = Q.defer();
    execFileOldschool(program, args, function(err, stdout, stderr) {
        deferred.resolve(stdout, stderr);
    });
    return deferred.promise;
}

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

function pylint(repoPath) {
    var msgTemplate = '{msg_id}|{path}|{line:3d}|{column}|{obj}|{msg}';
    return glob('**/*.py', { cwd: repoPath }).then(function(files) {
        return Q.all(files.map(function(file) {
            return execFileAlways('pylint', ['--msg-template', msgTemplate, path.join(repoPath, file)]);
        })).then(function(results) {
            if(results.length == 0) {
                return [];
            }

            return results.map(function(result) {
                return result.split('\n').filter(function(line) {
                    return line.match(/^\w{5}\|.*\|.*\|.*\|.*$/g);
                });
            }).reduce(function(a, b){
                return a.concat(b);
             }).map(function(line) {
                var tokens = line.split('|');
                return {
                    code: tokens[0],
                    path: tokens[1],
                    line: tokens[2],
                    column: tokens[3],
                    obj: tokens[4],
                    text: tokens[5]
                };
            });
        });
    });
}

function flake8(repoPath) {
    return execFileAlways('flake8', [repoPath]).then(function(stdout, stderr) {
        var re = /^(.*\.py):(\d*):(\d*): (\w{4}) (.*)$/g;
        return stdout.split('\n').map(function(line) {
            var m = re.exec(line);
            if (m != null) {
                return {
                    path: m[1],
                    line: m[2],
                    column: m[3],
                    code: m[4],
                    text: m[5]
                };
            }
        }).filter(function(v) {
            return v != null;
        });
    });
}


function pyflakes(repoPath) {
    return execFileAlways('pyflakes', [repoPath]).then(function(stdout, stderr) {
        return stdout.split('\n');
    });
}

function pep8(repoPath) {
    var format = '%(path)s|%(row)d|%(col)d|%(code)s|%(text)s';
    return execFileAlways('pep8', ['--format', format, repoPath]).then(function(stdout, stderr) {
        var lines = stdout.split("\n");
        return lines.map(function(val) {
            var tokens = val.split("|");
            return {
                path: tokens[0],
                line: tokens[1],
                column: tokens[2],
                code: tokens[3],
                text: tokens[4]
            };
        });
    });
}

function rubocop(repoPath) {
    return execFileAlways('rubocop', ['--lint', '--format', 'json', repoPath]).then(function(stdout) {
        return JSON.parse(stdout).files;
    });
}

function rubylint(repoPath) {
    var deferred = Q.defer();
    execFileOldschool('ruby-lint', ['--presenter', 'json', repoPath], { cwd: repoPath }, function(err, stdout, stderr) {
        deferred.resolve(JSON.parse(stdout));
    });
    return deferred.promise;
}

module.exports = function lint(repoPath) {
    return Q.all([
        pep8(repoPath),
        rubocop(repoPath),
        rubylint(repoPath),
        pyflakes(repoPath),
        pylint(repoPath),
        flake8(repoPath),
    ]).then(function(results) {
        return {
            pep8: results[0],
            rubocop: results[1],
            rubylint: results[2],
            pyflakes: results[3],
            pylint: results[4],
            flake8: results[5],
        };
    });
};
