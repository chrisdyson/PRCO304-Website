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


app.get('/contactsData', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
    });
    connection.connect();
    connection.query("SELECT * FROM user,teams,clubs WHERE teams.captain = user.userID AND teams.clubID = clubs.clubID ORDER BY clubName",
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
                    res.write('<table style="width: 85%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                    res.write('<tr><th class="w3-center" style="width:33%">Team</th><th class="w3-center" style="width:33%">Captain</th><th class="w3-center" style="width:33%">Email</th></tr>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<tr><td style="vertical-align:middle" class="w3-center w3-small w3-hide-medium w3-hide-large">' + rows[i].clubName + ' ' + rows[i].teamName + '</td><td style="vertical-align:middle" class="w3-center w3-hide-small">' + rows[i].clubName + ' ' + rows[i].teamName + '</td><td style="vertical-align:middle" class="w3-center w3-small w3-hide-medium w3-hide-large">' + rows[i].firstName + ' ' + rows[i].lastName + '</td><td style="vertical-align:middle" class="w3-center w3-hide-small" >' + rows[i].firstName + ' ' + rows[i].lastName + '</td><td style="vertical-align:middle" class="w3-center w3-small w3-hide-medium w3-hide-large"><a href="mailto:' + rows[i].email + '">' + rows[i].email + '</a></td><td style="vertical-align:middle" class="w3-center w3-hide-small"><a href="mailto:' + rows[i].email + '">' + rows[i].email + '</a></td></tr>');
                    }
                    res.write('</table><br><br>');
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

app.get('/viewMessages', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
    });
    connection.connect();
    connection.query("SELECT * FROM messages ORDER BY postDate DESC",
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

                    res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4"><tr><th style="width:80%">Message</th><th style="width:20%">Posted On</th></tr>');
                    for (i = 0; i < rows.length; i++) {
                        var postdate = String(rows[i].postDate).slice(0, -18);
                        res.write('<tr><td>' + rows[i].message + '</td><td>' + postdate + '</td></tr>');
                    }
                    res.write('</table>');
                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the message board data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the message board data");
                res.end();
            }
        });
});

app.get('/newMessage', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                    if (userType == "Admin") {
                        res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                        res.write('<link rel="stylesheet" href="w3.css">');
                        res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                        res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                        res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');
                        res.write('<h3 class="w3-center">New Message</h3>');
                        res.write('<form action="newMessage" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Message <span class="w3-text-red">*</span></b> <input id="txtCreateMessage" class="w3-input w3-left" type="text" name="message" autocomplete="off" required><br><br><br><br>');
                        res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Create">');
                        res.write('</div></form></div>');
                    }
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

app.post('/newMessage', function (req, res) {
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
            });

            var message = mysql.escape(post.message);

            connection.connect();
            connection.query("INSERT INTO messages (message) VALUES (" + message + ")",
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/messages";</script>');
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

app.get('/averagesData', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
    });
    connection.connect();
    connection.query("SELECT * FROM user,teams,clubs,league WHERE user.teamID=teams.teamID AND teams.clubID = clubs.clubID AND clubs.leagueID = league.leagueID ORDER BY division ASC, percentage DESC",
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
                    var pos = 1;
                    var numDivs = rows[0].numOfDivisions;
                    for (j = 1; j <= numDivs; j++) {
                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center w3-hide-small" colspan="6" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">Division ' + j + '</th><th class="w3-hide-medium w3-hide-large w3-center" colspan="5" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">Division ' + j + '</th></tr>');
                        res.write('<tr><th class="w3-center" style="width:5%">#</th><th class="w3-center" style="width:19%">Name</th><th class="w3-center w3-hide-small" style="width:19%">Team</th><th class="w3-center" style="width:19%">Played</th><th class="w3-center" style="width:19%">Wins</th><th class="w3-center" style="width:19%">%</th></tr>');

                        for (i = 0; i < rows.length; i++) {
                            var percent = rows[i].percentage;
                            if (percent == null) {
                                var percentConv = 0;
                            } else {
                                var percentConv = percent.toFixed(2);
                            }
                            if (rows[i].division == j) {
                                res.write('<tr><td style="vertical-align:middle" class="w3-center">' + pos + '</td><td style="vertical-align:middle" class="w3-center w3-small w3-hide-medium w3-hide-large">' + rows[i].firstName + ' ' + rows[i].lastName + '</td><td style="vertical-align:middle" class="w3-center w3-hide-small" >' + rows[i].firstName + ' ' + rows[i].lastName + '</td><td style="vertical-align:middle" class="w3-center w3-hide-small">' + rows[i].clubName + ' ' + rows[i].teamName + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].gamesPlayed + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].wins + '</td><td style="vertical-align:middle" class="w3-center">' + percentConv + '%</td></tr>');
                                pos = pos + 1;
                            }
                        }
                        pos = 1;
                        res.write('</table><br><br>');
                    }
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

app.get('/resultsData', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
    });
    connection.connect();
    var username = req.query.u;
    connection.query("SELECT * FROM teams,clubs,league WHERE teams.clubID = clubs.clubID AND clubs.leagueID = league.leagueID ORDER BY division ASC, points DESC",
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
                    var pos = 1;
                    var numDivs = rows[0].numOfDivisions;
                    for (j = 1; j <= numDivs; j++) {
                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all-fixtures w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center" colspan="7" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">Division ' + j + '</th></tr>');
                        res.write('<tr style="background-color: #f1f1f1;" class="w3-hide-small"><th class="w3-center" style="width:5%">#</th><th class="w3-center" style="width:calc(95% / 6)%">Team</th><th class="w3-center" style="width:calc(95% / 6)%">Played</th><th class="w3-center" style="width:calc(95% / 6)%">Wins</th><th class="w3-center" style="width:calc(95% / 6)%">Draws</th><th class="w3-center" style="width:calc(95% / 6)%">Losses</th><th class="w3-center" style="width:calc(95% / 6)%">Points</th></tr>');
                        res.write('<tr style="background-color: #f1f1f1;" class="w3-hide-medium w3-hide-large"><th class="w3-center" style="width:5%">#</th><th class="w3-center" style="width:calc(95% / 6)%">T</th><th class="w3-center" style="width:calc(95% / 6)%">P</th><th class="w3-center" style="width:calc(95% / 6)%">W</th><th class="w3-center" style="width:calc(95% / 6)%">D</th><th class="w3-center" style="width:calc(95% / 6)%">L</th><th class="w3-center" style="width:calc(95% / 6)%">Pts</th></tr>');

                        for (i = 0; i < rows.length; i++) {
                            if (rows[i].division == j) {
                                res.write('<tr><td style="vertical-align:middle" class="w3-center">' + pos + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].clubName + ' ' + rows[i].teamName + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamGamesPlayed + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamWins + '</td><td class="w3-center" style="vertical-align:middle">' + rows[i].teamDraws + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamLosses + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].points + '</td></tr>');
                                pos = pos + 1;
                            }
                        }
                        pos = 1;
                        res.write('</table><br><br>');

                    }

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

app.get('/profileData', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
    });
    connection.connect();
    var username = req.query.u;

    connection.query("SELECT * FROM user,teams,clubs WHERE user.teamID=teams.teamID AND teams.clubID = clubs.clubID AND user.username=" + mysql.escape(username),
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
                    res.write('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>');
                    res.write('<style type="text/css">#editEmailIcon:hover{color:#ff4d4d;cursor:pointer}</style>');

                    res.write('<script>function openEmailEditor() { $("#divEmail").hide();$("#divEmailChange").show();} window.onload = function() {$(".hiddenusername").val(localStorage.username)}</script>');
                    res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');

                    for (i = 0; i < rows.length; i++) {
                        var dob = "" + rows[i].dateOfBirth; //date of birth with extra date stuff at end
                        var convDob = dob.substr(0, 15); //date of birth with extra stuff removed
                        res.write('<h3>' + rows[i].firstName + ' ' + rows[i].lastName + '</h3>');

                        res.write('<p><div style="display:block" id="divEmail">' + rows[i].email + '&nbsp;&nbsp;&nbsp;<a onclick="openEmailEditor()"><i id="editEmailIcon" class="fa fa-pencil"></i></a></div><div id="divEmailChange" style="display:none"><form action="editProfileEmail" method="post"><input style="width:200px" id="txtEmail" class="w3-left w3-input" placeholder="Change Email..." type="email" name="email" autocomplete="off" required><input type="hidden" class="hiddenusername" name="username" value=""><input id="subEditBtn" style="border-bottom: 1px solid #ccc;" class="w3-center w3-button w3-ripple w3-white" type="submit" value="Edit"></form></div></p>');

                        res.write('<p><form action="editProfilePassword" method="post"><input style="width:200px" id="txtPassword" class="w3-left w3-input" placeholder="Change Password..." type="password" name="password" autocomplete="off" required><input type="hidden" class="hiddenusername" name="username" value=""><input id="subEditPasswordBtn" style="border-bottom: 1px solid #ccc;" class="w3-center w3-button w3-ripple w3-white" type="submit" value="Edit"></form></p><p style="display:none" id="lblUpdatePassMessage" class="w3-tag w3-padding w3-round-large w3-red w3-center">You still have the default password, please update this immediately for security reasons!</p>');
                        if (rows[i].password == "pass") {
                            res.write('<script>document.getElementById("lblUpdatePassMessage").style.display = "block";</script>');
                        } else {
                            res.write('<script>document.getElementById("lblUpdatePassMessage").style.display = "none";</script>');
                        }
                        res.write('<p>' + convDob + '</p>');
                    }
                    res.write('</div><br>');

                    if (rows[0].userType == "Admin") {
                        res.write('<div style="width:80%;margin: 0 auto;"><span id="btnViewAdmin" onclick="window.top.location.href=\'admin\'" style="background-color:#f1f1f1;cursor:pointer;padding: 12px 20px;" class="w3-center w3-card-4">View Admin Panel</span></div><br>');
                        res.write('<script>$("#btnViewAdmin").hover(function(){$(this).animate({"backgroundColor": "#525252","color":"#f2f2f2"},350);},function(){$(this).animate({"backgroundColor": "#f1f1f1","color":"#000"},350);});</script>');
                    }

                    for (i = 0; i < rows.length; i++) {
                        var percent = rows[i].percentage;
                        if (percent == null) {
                            var percentConv = 0;
                        } else {
                            var percentConv = percent.toFixed(2);
                        }

                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center" colspan="3" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">' + rows[i].username + ' (Div ' + rows[i].division + ') </th></tr>');
                        res.write('<tr><th class="w3-center" style="width:33%">Played</th><th class="w3-center" style="width:33%">Wins</th><th class="w3-center" style="width:33%">Win %</th></tr>');
                        res.write('<tr><td class="w3-center">' + rows[i].gamesPlayed + '</td><td class="w3-center">' + rows[i].wins + '</td><td class="w3-center">' + percentConv + '%</td></tr>');
                        res.write('</table>');
                        res.write('<br>');
                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center" colspan="5" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">' + rows[i].clubName + ' ' + rows[i].teamName + '</th></tr>');
                        res.write('<tr class="w3-hide-small"><th class="w3-center" style="width: calc(100% / 5);">Played</th><th class="w3-center" style="width: calc(100% / 5);">Wins</th><th class="w3-center" style="width: calc(100% / 5);">Draws</th><th class="w3-center" style="width: calc(100% / 5);">Losses</th><th class="w3-center" style="width: calc(100% / 5);">Points</th></tr>');
                        res.write('<tr style="background-color: #f1f1f1;" class="w3-hide-large w3-hide-medium"><th class="w3-center" style="width: calc(100% / 5);">P</th><th class="w3-center" style="width: calc(100% / 5);">W</th><th class="w3-center" style="width: calc(100% / 5);">D</th><th class="w3-center" style="width: calc(100% / 5);">L</th><th class="w3-center" style="width: calc(100% / 5);">Pts</th></tr>');
                        res.write('<tr style="background-color: #fff;"><td class="w3-center">' + rows[i].teamGamesPlayed + '</td><td class="w3-center">' + rows[i].teamWins + '</td><td class="w3-center">' + rows[i].teamDraws + '</td><td class="w3-center">' + rows[i].teamLosses + '</td><td class="w3-center">' + rows[i].points + '</td></tr>');
                        res.write('</table>');
                    }

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

app.get('/addProfile', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                        res.write('<h3 class="w3-center">Create User</h3>');
                        res.write('<form action="createProfile" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Username <span class="w3-text-red">*</span></b> <input id="txtCreateUsername" class="w3-input w3-left" type="text" name="username" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>First Name <span class="w3-text-red">*</span></b> <input id="txtCreateFName" class="w3-input w3-left" type="text" name="firstName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Last Name <span class="w3-text-red">*</span></b> <input id="txtCreateLName" class="w3-input w3-left" type="text" name="lastName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Email <span class="w3-text-red">*</span></b> <input id="txtCreateEmail" class="w3-input w3-left" type="email" name="email" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>D.o.B <span class="w3-text-red">*</span></b> <input id="inputCreateDob" class="w3-input w3-left w3-white" type="date" name="dob" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Team <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="team" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');

                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].teamID + '">' + rows[i].clubName + ' ' + rows[i].teamName + '</option>');
                        }
                        res.write('</select><br><br><br>');
                        res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Create">');
                    } else {
                        res.write('<br>Sorry, you do not have admin priviledges<br><br>');
                        res.write('<script>window.top.location.href = "/profile";</script>');
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

app.post('/createProfile', function (req, res) {
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
            });

            var username = mysql.escape(post.username);
            var email = mysql.escape(post.email);
            var firstName = mysql.escape(post.firstName);
            var lastName = mysql.escape(post.lastName);
            var dob = mysql.escape(post.dob);
            var team = mysql.escape(post.team);

            connection.connect();
            connection.query("INSERT INTO user (username, email, password, firstName, lastName, dateOfBirth, teamID, gamesPlayed, wins, losses) VALUES (" + username + "," + email + ", 'pass'," + firstName + "," + lastName + "," + dob + "," + team + ", 0, 0, 0 )",
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

app.get('/addClub', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                        res.write('<form action="createClub" method="post">');
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

app.post('/createClub', function (req, res) {
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                        res.write('<form action="createTeam" method="post">');
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

app.post('/createTeam', function (req, res) {
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
    connection.query("SELECT * FROM user ORDER BY lastName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Delete User</h3>');
                        res.write('<form action="deleteProfile" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>User <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="user" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');
                        for (i = 0; i < rows.length; i++) {
                            res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
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

app.post('/deleteProfile', function (req, res) {
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
            });

            connection.connect();
            connection.query("DELETE FROM user WHERE userID = " + mysql.escape(post.user),
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

app.get('/deleteClub', function (req, res) {
    var connection = mysql.createConnection({
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
        host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
        user: 'chris',
        password: 'mydbpass',
        database: 'TTdb'
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
                host: 'mydbttwebapp.cmv2uuxtdson.us-east-2.rds.amazonaws.com',
                user: 'chris',
                password: 'mydbpass',
                database: 'TTdb'
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
