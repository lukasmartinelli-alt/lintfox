'use strict';
var Q = require('q');
var linter = require('./linter');

module.exports = function(app, cache) {
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
