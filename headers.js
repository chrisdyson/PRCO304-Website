var mysql = require('mysql');
var qs = require('querystring');
var dbHost = 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com';
var dbUser = 'chris';
var dbPassword = 'mydbpass';
var dbDatabase = 'TTdb';

exports.mysql = mysql;
exports.qs = qs;
exports.dbHost = dbHost;
exports.dbUser = dbUser;
exports.dbPassword = dbPassword;
exports.dbDatabase = dbDatabase;