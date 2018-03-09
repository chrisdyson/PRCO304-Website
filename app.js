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

var dbHost = 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com';
var dbUser = 'chris';
var dbPassword = 'mydbpass';
var dbDatabase = 'TTdb';

var contacts = require('./contacts.js');
var messages = require('./messages.js');
var averagesResults = require('./avgres.js');
var profile = require('./profile.js');
var adminProfile = require('./adminprofile.js');

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

app.get('/addProfile', function (req, res) {
    adminProfile.pageDataCreateProfile(req, res);
});

app.post('/addProfile', function (req, res) {
    adminProfile.pageDataCreateProfilePost(req, res);
});

app.get('/addClub', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var username = req.query.u;
    var userType = "";
    connection.query("SELECT * FROM user WHERE username = " + mysql.escape(username),
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    userType = rows[0].userType;
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
    connection.query("SELECT * FROM league ORDER BY leagueName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Create Club</h3>');
                        res.write('<form action="addClub" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Club Name <span class="w3-text-red">*</span></b> <input id="txtCreateName" class="w3-input w3-left" type="text" name="clubName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Address <span class="w3-text-red">*</span></b> <input id="txtCreateAddress" class="w3-input w3-left" type="text" name="clubAddress" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Map Latitude <span class="w3-text-red">*</span></b> <input id="txtCreateLat" class="w3-input w3-left" type="text" name="clubLat" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Map Longitude <span class="w3-text-red">*</span></b> <input id="txtCreateLong" class="w3-input w3-left" type="text" name="clubLong" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Map Label <span class="w3-text-red">*</span></b> <input id="inputCreateLabel" class="w3-input w3-left" type="text" name="clubLabel" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>League <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="league" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');

                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].leagueID + '">' + rows[i].leagueName + '</option>');
                        }
                        res.write('</select><br><br><br>');
                        res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Create">');
                    } else {
                        res.write('<br>Sorry, you do not have admin priviledges<br><br>');
                    }
                    res.write('</div></form></div>');


                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
});

app.post('/addClub', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            var clubName = mysql.escape(post.clubName);
            var clubAddress = mysql.escape(post.clubAddress);
            var clubLat = mysql.escape(post.clubLat);
            var clubLong = mysql.escape(post.clubLong);
            var clubLabel = mysql.escape(post.clubLabel);
            var league = mysql.escape(post.league);

            connection.connect();
            connection.query("INSERT INTO clubs (clubName, clubLocation, clublat, clubLong, clubMapLabel, leagueID) VALUES (" + clubName + "," + clubAddress + "," + clubLat + "," + clubLong + "," + clubLabel + "," + league + ")",
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/admin";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }
});


app.get('/addTeam', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var username = req.query.u;
    var userType = "";
    connection.query("SELECT * FROM user WHERE username = " + mysql.escape(username),
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    userType = rows[0].userType;
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
    connection.query("SELECT * FROM clubs,league WHERE clubs.leagueID = league.leagueID ORDER BY clubName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Create Team</h3>');
                        res.write('<form action="addTeam" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Club <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="club" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');
                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].clubID + '">' + rows[i].clubName + '</option>');
                        }
                        res.write('</select><br><br>');
                        res.write('<b>Team Name <span class="w3-text-red">*</span></b> <input id="txtCreateName" class="w3-input w3-left" maxlength="1" type="text" name="teamName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Division <span class="w3-text-red">*</span></b> <input id="txtCreateDiv" class="w3-input w3-left" min="0" max="' + rows[0].numOfDivisions + '" type="number" name="teamDiv" autocomplete="off" required><br><br><br><br>');

                        res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Create">');
                    } else {
                        res.write('<br>Sorry, you do not have admin priviledges<br><br>');
                    }
                    res.write('</div></form></div>');


                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
});

app.post('/addTeam', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            var teamName = mysql.escape(post.teamName);
            var teamDiv = mysql.escape(post.teamDiv);
            var club = mysql.escape(post.club);

            connection.connect();
            connection.query("INSERT INTO teams (clubID, teamName, division) VALUES (" + club + "," + teamName + "," + teamDiv + ")",
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        var url = "/assignCaptain?name=" + post.teamName + "&club=" + post.club;
                        res.write('<script>location.href = "' + url + '";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }
});

app.get('/deleteProfile', function (req, res) {
    adminProfile.pageDataDeleteProfile(req, res);
});

app.post('/deleteProfile', function (req, res) {
    adminProfile.pageDataDeleteProfilePost(req, res);
});

app.get('/deleteClub', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var username = req.query.u;
    var userType = "";
    connection.query("SELECT * FROM user WHERE username = " + mysql.escape(username),
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    userType = rows[0].userType;
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
    connection.query("SELECT * FROM clubs ORDER BY clubName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Delete Club</h3>');
                        res.write('<form action="deleteClub" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Club <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="club" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');
                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].clubID + '">' + rows[i].clubName + '</option>');
                        }
                        res.write('</select><br><br>');
                        res.write('<b>Confirm <span class="w3-text-red">*</span></b><br> <input class="w3-check" type="checkbox" required><br><br>');

                        res.write('<input id="deleteBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Delete">');
                    } else {
                        res.write('<br>Sorry, you do not have admin priviledges<br><br>');
                    }
                    res.write('</div></form></div>');


                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
});

app.post('/deleteClub', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            connection.connect();
            connection.query("DELETE FROM clubs WHERE clubID = " + mysql.escape(post.club),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/admin";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }
});

app.get('/deleteTeam', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var username = req.query.u;
    var userType = "";
    connection.query("SELECT * FROM user WHERE username = " + mysql.escape(username),
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    userType = rows[0].userType;
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
    connection.query("SELECT * FROM teams, clubs WHERE teams.clubID = clubs.clubID ORDER BY clubName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Delete Team</h3>');
                        res.write('<form action="deleteTeam" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Team <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="team" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');
                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].teamID + '">' + rows[i].clubName + ' ' + rows[i].teamName + '</option>');
                        }
                        res.write('</select><br><br>');
                        res.write('<b>Confirm <span class="w3-text-red">*</span></b><br> <input class="w3-check" type="checkbox" required><br><br>');

                        res.write('<input id="deleteBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Delete">');
                    } else {
                        res.write('<br>Sorry, you do not have admin priviledges<br><br>');
                    }
                    res.write('</div></form></div>');


                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
});

app.post('/deleteTeam', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            connection.connect();
            connection.query("DELETE FROM teams WHERE teamID = " + mysql.escape(post.team),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/admin";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }
});

app.get('/assignCaptain', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var teamName = req.query.name;
    var club = req.query.club;
    connection.query("SELECT * FROM user ORDER BY lastName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');

                    res.write('<h3 class="w3-center">Assign Captain</h3>');
                    res.write('<form action="assignCaptain" method="post">');
                    res.write('<div class="w3-white" style="padding:40px;">');
                    res.write('<b>User <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="user" autocomplete="off" required>');
                    res.write('<option value="" disabled selected>Select...</option>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                    }
                    res.write('</select><br><br>');
                    res.write('<b>Confirm <span class="w3-text-red">*</span></b><br> <input class="w3-check" type="checkbox" required><br><br>');
                    res.write('<input type="hidden" id="hiddenName" name="name" value="' + teamName + '">');
                    res.write('<input type="hidden" id="hiddenClub" name="club" value="' + club + '">');
                    res.write('<input id="deleteBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Update">');

                    res.write('</div></form></div>');


                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the user data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });
});

app.post('/assignCaptain', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            connection.connect();
            connection.query("UPDATE teams SET captain = " + mysql.escape(post.user) + " WHERE teamName = " + mysql.escape(post.name) + "AND clubID = " + mysql.escape(post.club),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/admin";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }
});
app.post('/editProfileEmail', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });
            connection.connect();
            connection.query("UPDATE user SET email = " + mysql.escape(post.email) + " WHERE username = " + mysql.escape(post.username),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/profile";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                        res.write('<link rel="stylesheet" href="w3.css">');
                        res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                        res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                        res.write('<style type="text/css">#editEmailIcon:hover{color:#ff4d4d;cursor:pointer}</style>');
                        res.write('<script>function openEmailEditor() { $("#divEmail").hide();$("#divEmailChange").show();$("#hiddenusername").val(localStorage.username) }</script>');
                        res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');

                        for (i = 0; i < rows.length; i++) {
                            var dob = "" + rows[i].dateOfBirth;
                            var convDob = dob.substr(0, 15);
                            res.write('<h3>' + rows[i].firstName + ' ' + rows[i].lastName + '</h3>');
                            res.write('<p><div style="display:none" id="divEmail">' + rows[i].email + '&nbsp;&nbsp;<a onclick="openEmailEditor()"><i id="editEmailIcon" class="fa fa-pencil"></i></a></div><div id="divEmailChange" style="display:block"><form action="editProfile" method="post"><input style="width:200px" id="txtEmail" class="w3-input-red w3-left w3-input" type="email" name="email" autocomplete="off" required><input type="hidden" id="hiddenusername" name="username" value=""><input id="subEditBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Submit"></form><br></div></p>');
                            res.write('<p>' + convDob + '</p>');
                        }
                        res.write('</div>');

                        res.end();
                        connection.end();
                    }
                });
        });
    }
});

app.post('/editProfilePassword', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });
            connection.connect();
            connection.query("UPDATE user SET password = " + mysql.escape(post.password) + " WHERE username = " + mysql.escape(post.username),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/profile";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                        res.write('<link rel="stylesheet" href="w3.css">');
                        res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                        res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                        res.write('<style type="text/css">#editEmailIcon:hover{color:#ff4d4d;cursor:pointer}</style>');
                        res.write('<script>function openEmailEditor() { $("#divEmail").hide();$("#divEmailChange").show();$("#hiddenusername").val(localStorage.username) }</script>')
                        res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');

                        for (i = 0; i < rows.length; i++) {
                            var dob = "" + rows[i].dateOfBirth;
                            var convDob = dob.substr(0, 15);
                            res.write('<h3>' + rows[i].firstName + ' ' + rows[i].lastName + '</h3>');
                            res.write('<p><div style="display:none" id="divEmail">' + rows[i].email + '&nbsp;&nbsp;<a onclick="openEmailEditor()"><i id="editEmailIcon" class="fa fa-pencil"></i></a></div><div id="divEmailChange" style="display:block"><form action="editProfile" method="post"><input style="width:200px" id="txtEmail" class="w3-input-red w3-left w3-input" type="email" name="email" autocomplete="off" required><input type="hidden" id="hiddenusername" name="username" value=""><input id="subEditBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Submit"></form><br></div></p>');
                            res.write('<p>' + convDob + '</p>');
                        }
                        res.write('</div>');

                        res.end();
                        connection.end();
                    }
                });
        });
    }
});

app.get('/venueData', function (req, res) {
    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    connection.query("SELECT * FROM clubs ORDER BY clubName;",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<table style="width: 95%;margin: 0 auto;" class="w3-table-all w3-card-4"><tr><th style="width:50%">Club</th><th style="width:50%">Location</th></tr>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<tr><td>' + rows[i].clubName + '</td><td>' + rows[i].clubLocation + '</td></tr>');
                    }
                    res.write('</table>');
                    res.write('<br>')
                    res.write('<script>function initMap() {')
                    res.write('var mapOptions = {center: new google.maps.LatLng(50.379946, -4.139527),zoom: 13,mapTypeId: google.maps.MapTypeId.HYBRID};')
                    res.write('var map = new google.maps.Map(document.getElementById("map"), mapOptions);');
                    res.write('var markers = [];var contents = [];var infowindows = [];')

                    var j = 0;
                    for (; rows[j];) {
                        res.write('markers[' + j + '] = new google.maps.Marker({position: new google.maps.LatLng(' + rows[j].clubLat + ', ' + rows[j].clubLong + '),map: map});');
                        res.write('markers[' + j + '].index = ' + j + ';contents[' + j + '] = "' + rows[j].clubMapLabel + '";');
                        res.write('infowindows[' + j + '] = new google.maps.InfoWindow({content: contents[' + j + '],maxWidth: 300});');
                        res.write('google.maps.event.addListener(markers[' + j + '], "click", function () {infowindows[this.index].open(map, markers[this.index]);map.panTo(markers[this.index].getPosition())});');
                        j++;
                    }

                    res.write('} </script>');
                    res.write('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtssf_r1Vdlc8hqU7VE-ThqgabZ-4rE2I&callback=initMap"></script>');
                    res.write('<div class="w3-round-large w3-card-4" style="height: 600px;width: 95%;margin: 0 auto;" id="map"></div>');
                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the venues data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the venues data");
                res.end();
            }
        });

});

app.get('/loginForm', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<link rel="stylesheet" href="w3.css">');
    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
    res.write('<form class="w3-center" action="login" method="post">');
    res.write('<div class="w3-white" style="padding:40px;">');
    res.write('<b>Username <span class="w3-text-red">*</span></b> <input id="txtLoginUsername" class="w3-input w3-center" type="text" name="username" autocomplete="off" required><br><br>');
    res.write('<b>Password <span class="w3-text-red">*</span></b> <input id="txtLoginPassword" class="w3-input w3-center" type="password" name="password" autocomplete="off" required><br><br>');
    res.write('<input id="loginBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Login">');
    res.write('</div></form>');
    return res.end();
});

app.post('/login', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var connection = mysql.createConnection({
                host: dbHost,
                user: dbUser,
                password: dbPassword,
                database: dbDatabase
            });

            connection.connect();
            connection.query("SELECT * FROM user WHERE username = " + mysql.escape(post.username) + "AND password = " + mysql.escape(post.password),
                function (err, rows, fields) {
                    if (!err) {
                        if (rows != '') {
                            userUsername = rows[0].username;
                            connection.end();
                            res.write('<script>localStorage.setItem("username", "' + userUsername + '");window.top.location.href = "/profile"; </script>');
                            return res.end();
                        } else { //error, user not found or password incorrect
                            connection.end();
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            res.write('<link rel="stylesheet" href="w3.css">');
                            res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                            res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                            res.write('<form class="w3-center" action="login" method="post">');
                            res.write('<div class="w3-white" style="padding:40px;">');
                            res.write('<b>Username <span class="w3-text-red">*</span></b> <input id="txtLoginUsername" class="w3-input-red w3-center" type="text" name="username" autocomplete="off" required><br><br>');
                            res.write('<b>Password <span class="w3-text-red">*</span></b> <input id="txtLoginPassword" class="w3-input-red w3-center" type="password" name="password" autocomplete="off" required><br><br>');
                            res.write('<input id="loginBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Login">');
                            res.write('</div></form>');
                            return res.end();
                        }
                    } else { //error
                        console.log('Error while performing Query.');
                        connection.end();
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        res.write('<link rel="stylesheet" href="w3.css">');
                        res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                        res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                        res.write('<form class="w3-center" action="login" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Username <span class="w3-text-red">*</span></b> <input id="txtLoginUsername" class="w3-input-red w3-center" type="text" name="username" autocomplete="off" required><br><br>');
                        res.write('<b>Password <span class="w3-text-red">*</span></b> <input id="txtLoginPassword" class="w3-input-red w3-center" type="password" name="password" autocomplete="off" required><br><br>');
                        res.write('<input id="loginBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Login">');
                        res.write('</div></form>');
                        return res.end();
                    }
                });
        });
    }
});
