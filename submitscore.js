var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataSelectTeam = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    var username = req.query.u;
    var userType = "";
    var userID = "";
    var teamID = "";
    var teamName = "";
    var clubName = "";
    var division = "";
    connection.query("SELECT * FROM user,teams,clubs WHERE teams.captain = user.userID AND teams.clubID = clubs.clubID AND username = " + mysql.escape(username),
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    userType = "Captain";
                    userID = rows[0].userID;
                    teamID = rows[0].teamID;
                    teamName = rows[0].teamName;
                    clubName = rows[0].clubName;
                    division = rows[0].division;
                } else { //error - no data
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    //console.log('Error while performing Query.');
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<div class="w3-container w3-card-4 w3-padding" style="width:85%;margin: 0 auto;">');
                    res.write("<p>Sorry, you need to be a team captain to upload scores</p>");
                    res.write('</div>');
                    userType = "Player";
                    //res.end();
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
                    if (userType == "Captain") {
                        res.write('<h3 class="w3-center">Select Opponent</h3>');
                        res.write('<form action="submitScorePlayer" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Home Team </b><br> <select class="w3-select w3-white" name="" autocomplete="off">');
                        res.write('<option value="' + teamID + '" disabled selected>' + clubName + ' ' + teamName + '</option>');
                        res.write('</select><br><br><br>');
                        res.write('<input type="hidden" name="homeTeam" value="' + teamID + '">');
                        res.write('<b>Away Team </b><br> <select class="w3-select w3-white" name="awayTeam" autocomplete="off">');
                        res.write('<option value="" disabled selected>Select...</option>');

                        for (i = 0; i < rows.length; i++) {
                            if (rows[i].teamID != teamID && rows[i].division == division) {
                                res.write('<option value="' + rows[i].teamID + '">' + rows[i].clubName + ' ' + rows[i].teamName + '</option>');
                            }
                        }
                        res.write('</select><br><br><br>');
                        res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Next">');
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

}

exports.pageDataSelectPlayer = function (req, res) {

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

            var homeTeamID = post.homeTeam;
            var awayTeamID = post.awayTeam;

            connection.connect();
            connection.query("SELECT * FROM user",
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
                            res.write('<h3 class="w3-center">Select Players</h3>');
                            res.write('<form action="submitScoreScores" method="post">');
                            res.write('<div class="w3-white" style="padding:40px;">');
                            res.write('<b>Home Team </b><br>');
                            res.write('<p><i>Singles</i></p>');
                            for (j = 1; j < 4; j++) {
                                res.write('<select class="w3-select w3-white" name="homeTeam' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == homeTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('<option value="noPlayer">No Player</option>');
                                res.write('</select><br><br>');
                            }
                            res.write('<p><i>Doubles</i></p>');
                            for (j = 1; j < 3; j++) {
                                res.write('<select class="w3-select w3-white" name="homeTeamD' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == homeTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('</select><br><br>');
                            }
                            res.write('<br>');
                            res.write('<b>Away Team </b><br>');
                            res.write('<p><i>Singles</i></p>');
                            for (j = 1; j < 4; j++) {
                                res.write('<select class="w3-select w3-white" name="awayTeam' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');

                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == awayTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('<option value="noPlayer">No Player</option>');
                                res.write('</select><br><br>');
                            }
                            res.write('<p><i>Doubles</i></p>');
                            for (j = 1; j < 3; j++) {
                                res.write('<select class="w3-select w3-white" name="awayTeamD' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == awayTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('</select><br><br>');
                            }
                            res.write('<br>');
                            res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Next">');
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
    }

}

exports.pageDataEnterScores = function (req, res) {

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

            var homeTeamID = post.homeTeam;
            var awayTeamID = post.awayTeam;

            connection.connect();
            connection.query("SELECT * FROM user",
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

                            res.write('<h3 class="w3-center">Enter Scores</h3>');
                            res.write('<form action="addProfile" method="post">');
                            res.write('<div class="w3-white" style="padding:40px;">');
                            res.write('<b>Home Team </b><br>');
                            for (j = 1; j < 4; j++) {
                                res.write('<select class="w3-select w3-white" name="homeTeam' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');

                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == homeTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('<option value="noPlayer">No Player</option>');
                                res.write('</select><br><br>');
                            }

                            res.write('<br>');

                            res.write('<b>Away Team </b><br>');
                            for (j = 1; j < 4; j++) {
                                res.write('<select class="w3-select w3-white" name="awayTeam' + j + '" autocomplete="off">');
                                res.write('<option value="" disabled selected>Select...</option>');

                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == awayTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                res.write('<option value="" disabled>--------------------</option>');
                                res.write('<option value="playedUp">Played Up</option>');
                                res.write('<option value="noPlayer">No Player</option>');
                                res.write('</select><br><br>');
                            }

                            res.write('<br>');
                            res.write('<input id="createBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Next">');

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
    }

}
