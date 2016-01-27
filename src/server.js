'use strict';
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);

var options = {
    port: process.env.VCAP_APP_PORT || 3000
};

app.use(bodyParser.urlencoded({ extended: false }));

require('./api')(app);

http.listen(options.port);
