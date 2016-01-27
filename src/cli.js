'use strict';
var path = require('path');
var lint = require('./lint');

var repoPath = process.env.REPO_PATH;

lint(repoPath).then(function(results) {
    console.log(JSON.stringify(results, null, 2));
}).catch(function(err) {
    console.log("%j", err);
});
