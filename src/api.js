'use strict';
var Q = require('q');
var lint = require('./linters');

module.exports = function(app, cache) {
    app.get('/lint/', function(req, res) {
        var repo = req.query.git_repo;
        console.log(req.query);
        lint(repo).then(function(results) {
            res.json(results);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.get('/commits/', function(req, res) {
        var repo = req.query.git_repo;
        console.log(req.query);
        linter.gitCommits(repo).then(function(commits) {
            res.json(commits);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.get('/lints/:commit', function(req, res) {
        var repo = req.query.git_repo;
        var commit = req.params.commit;

        linter.pep8(repo).then(function(lintOutput) {
            res.json(lintOutput);
        }).catch(function(err) {
            res.json(err);
        });
    });
};
