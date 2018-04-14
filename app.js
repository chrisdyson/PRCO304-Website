var app = require('express')();
var http = require('http').Server(app);
var mysql = require('mysql');
var qs = require('querystring');

http.listen(80, function () {
    console.log('listening on :80');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/favicon.png', function (req, res) {
    res.sendFile(__dirname + '/favicon.png');
});

app.get('/favicon.ico', function (req, res) {
    res.sendFile(__dirname + '/favicon.ico');
});

app.get('/ttball.png', function (req, res) {
    res.sendFile(__dirname + '/ttball.png');
});

app.get('/w3.css', function (req, res) {
    res.sendFile(__dirname + '/w3.css');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/venues', function (req, res) {
    res.sendFile(__dirname + '/venues.html');
});

app.get('/contacts', function (req, res) {
    res.sendFile(__dirname + '/contacts.html');
});

app.get('/rules', function (req, res) {
    res.sendFile(__dirname + '/rules.html');
});

app.get('/news', function (req, res) {
    res.sendFile(__dirname + '/news.html');
});

app.get('/averages', function (req, res) {
    res.sendFile(__dirname + '/averages.html');
});

app.get('/results', function (req, res) {
    res.sendFile(__dirname + '/results.html');
});

app.get('/submitscore', function (req, res) {
    res.sendFile(__dirname + '/submitscore.html');
});

app.get('/scoreboard', function (req, res) {
    res.sendFile(__dirname + '/scoreboard.html');
});

app.get('/mobileapps', function (req, res) {
    res.sendFile(__dirname + '/mobileapps.html');
});

app.get('/profile', function (req, res) {
    res.sendFile(__dirname + '/profile.html');
});

app.get('/messages', function (req, res) {
    res.sendFile(__dirname + '/messages.html');
});

app.get('/viewResults', function (req, res) {
    res.sendFile(__dirname + '/viewResults.html');
});

var contacts = require('./contacts.js');
var messages = require('./messages.js');
var averagesResults = require('./avgres.js');
var profile = require('./profile.js');
var admin = require('./resetseason.js');
var adminProfile = require('./adminprofile.js');
var adminClub = require('./adminclub.js');
var adminTeam = require('./adminteam.js');
var login = require('./login.js');
var venues = require('./venues.js');
var editProfile = require('./editprofile.js');
var submitScore = require('./submitscore.js');
var playerResults = require('./playerresults.js');
var teamResults = require('./teamresults.js');

app.get('/contactsData', function (req, res) {
    contacts.pageData(req, res);
});

app.get('/viewMessages', function (req, res) {
    messages.pageDataViewMessages(req, res);
});

app.get('/newMessage', function (req, res) {
    messages.pageDataNewMessage(req, res);
});

app.post('/newMessage', function (req, res) {
    messages.pageDataNewMessagePost(req, res);
});

app.get('/averagesData', function (req, res) {
    averagesResults.pageDataAverages(req, res);
});

app.get('/resultsData', function (req, res) {
    averagesResults.pageDataResults(req, res);
});

app.get('/profileData', function (req, res) {
    profile.pageData(req, res);
});

app.get('/resetSeason', function (req, res) {
    admin.pageData(req, res);
});

app.post('/resetSeason', function (req, res) {
    admin.pageDataPost(req, res);
});

app.get('/addProfile', function (req, res) {
    adminProfile.pageDataCreateProfile(req, res);
});

app.post('/addProfile', function (req, res) {
    adminProfile.pageDataCreateProfilePost(req, res);
});

app.get('/addProfileMailChimp', function (req, res) {
    adminProfile.pageDataMailChimpPost(req, res);
});

app.get('/addClub', function (req, res) {
    adminClub.pageDataCreateClub(req, res);
});

app.post('/addClub', function (req, res) {
    adminClub.pageDataCreateClubPost(req, res);
});

app.get('/addTeam', function (req, res) {
    adminTeam.pageDataCreateTeam(req, res);
});

app.post('/addTeam', function (req, res) {
    adminTeam.pageDataCreateTeamPost(req, res);
});

app.get('/deleteProfile', function (req, res) {
    adminProfile.pageDataDeleteProfile(req, res);
});

app.post('/deleteProfile', function (req, res) {
    adminProfile.pageDataDeleteProfilePost(req, res);
});

app.get('/deleteClub', function (req, res) {
    adminClub.pageDataDeleteClub(req, res);
});

app.post('/deleteClub', function (req, res) {
    adminClub.pageDataDeleteClubPost(req, res);
});

app.get('/deleteTeam', function (req, res) {
    adminTeam.pageDataDeleteTeam(req, res);
});

app.post('/deleteTeam', function (req, res) {
    adminTeam.pageDataDeleteTeamPost(req, res);
});

app.get('/assignCaptain', function (req, res) {
    adminTeam.pageDataAssignCaptain(req, res);
});

app.post('/assignCaptain', function (req, res) {
    adminTeam.pageDataAssignCaptainPost(req, res);
});

app.post('/editProfileEmail', function (req, res) {
    editProfile.pageDataEditEmailPost(req, res);
});

app.post('/editProfilePassword', function (req, res) {
    editProfile.pageDataEditPasswordPost(req, res);
});

app.get('/venueData', function (req, res) {
    venues.pageDataView(req, res);
});

app.get('/loginForm', function (req, res) {
    login.pageDataViewLogin(req, res);
});

app.post('/login', function (req, res) {
    login.pageDataPostLogin(req, res);
});

app.get('/submitScoreTeam', function (req, res) {
    submitScore.pageDataSelectTeam(req, res);
});

app.post('/submitScorePlayer', function (req, res) {
    submitScore.pageDataSelectPlayer(req, res);
});

app.post('/submitScoreScores', function (req, res) {
    submitScore.pageDataEnterScores(req, res);
});

app.post('/submitScorePost', function (req, res) {
    submitScore.pageDataPostSubmitScores(req, res);
});

app.get('/playerResults', function (req, res) {
    playerResults.pageData(req, res);
});

app.get('/teamResults', function (req, res) {
    teamResults.pageData(req, res);
});