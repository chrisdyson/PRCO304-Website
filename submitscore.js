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

                    res.write('<script type="text/javascript">function setATname(selectAway){document.forms["form1"].awayTeamNameInput.value = selectAway.options[selectAway.options.selectedIndex].text;}</script>')

                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Captain") {
                        res.write('<h3 class="w3-center">Select Opponent</h3>');
                        res.write('<form name="form1" action="submitScorePlayer" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Home Team </b><br> <select class="w3-select w3-white" name="" autocomplete="off">');
                        res.write('<option value="' + teamID + '" disabled selected>' + clubName + ' ' + teamName + '</option>');
                        res.write('<input type="hidden" name="homeTeamName" value="' + clubName + ' ' + teamName + '">');
                        res.write('</select><br><br><br>');
                        res.write('<input type="hidden" name="homeTeam" value="' + teamID + '">');
                        res.write('<b>Away Team </b><br> <select class="w3-select w3-white" name="awayTeam" onchange="javascript:setATname(this);" autocomplete="off" required>');
                        res.write('<option value="" disabled selected>Select...</option>');

                        for (i = 0; i < rows.length; i++) {
                            if (rows[i].teamID != teamID && rows[i].division == division) {
                                var team = rows[i].clubName + ' ' + rows[i].teamName;
                                res.write('<option value="' + rows[i].teamID + '">' + team + '</option>');
                            }
                        }
                        res.write('</select><br><br><br>');
                        res.write('<input type="hidden" name="awayTeamNameInput">');
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
                                res.write('<select class="w3-select w3-white" name="homeTeam' + j + '" autocomplete="off" required>');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == homeTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                if (j == 3) {
                                    res.write('<option value="" disabled>--------------------</option>');
                                    res.write('<option value="playedUp">Played Up</option>');
                                    res.write('<option value="noPlayer">No Player</option>');
                                }
                                res.write('</select><br><br>');

                            }
                            res.write('<p><i>Doubles</i></p>');
                            for (j = 1; j < 3; j++) {
                                res.write('<select class="w3-select w3-white" name="homeTeamD' + j + '" autocomplete="off" required>');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == homeTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                if (j == 2) {
                                    res.write('<option value="" disabled>--------------------</option>');
                                    res.write('<option value="playedUp">Played Up</option>');
                                }
                                res.write('</select><br><br>');

                            }
                            res.write('<br>');
                            res.write('<b>Away Team </b><br>');
                            res.write('<p><i>Singles</i></p>');
                            for (j = 1; j < 4; j++) {
                                res.write('<select class="w3-select w3-white" name="awayTeam' + j + '" autocomplete="off" required>');
                                res.write('<option value="" disabled selected>Select...</option>');

                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == awayTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                if (j == 3) {
                                    res.write('<option value="" disabled>--------------------</option>');
                                    res.write('<option value="playedUp">Played Up</option>');
                                    res.write('<option value="noPlayer">No Player</option>');
                                }
                                res.write('</select><br><br>');

                            }
                            res.write('<p><i>Doubles</i></p>');
                            for (j = 1; j < 3; j++) {
                                res.write('<select class="w3-select w3-white" name="awayTeamD' + j + '" autocomplete="off" required>');
                                res.write('<option value="" disabled selected>Select...</option>');
                                for (i = 0; i < rows.length; i++) {
                                    if (rows[i].teamID == awayTeamID) {
                                        res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                                    }
                                }
                                if (j == 2) {
                                    res.write('<option value="" disabled>--------------------</option>');
                                    res.write('<option value="playedUp">Played Up</option>');
                                }
                                res.write('</select><br><br>');

                            }
                            res.write('<br>');
                            res.write('<input type="hidden" name="homeTeam" value="' + homeTeamID + '">');
                            res.write('<input type="hidden" name="awayTeam" value="' + awayTeamID + '">');
                            res.write('<input type="hidden" name="homeTeamName" value="' + post.homeTeamName + '">');
                            res.write('<input type="hidden" name="awayTeamName" value="' + post.awayTeamNameInput + '">');
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

            var A = post.homeTeam1;
            var Aname = "";
            var B = post.homeTeam2;
            var Bname = "";
            var C = post.homeTeam3;
            var Cname = "";
            var DH1 = post.homeTeamD1;
            var DH2 = post.homeTeamD2;
            var DHname1 = "";
            var DHname2 = "";

            var X = post.awayTeam1;
            var Xname = "";
            var Y = post.awayTeam2;
            var Yname = "";
            var Z = post.awayTeam3;
            var Zname = "";
            var DA1 = post.awayTeamD1;
            var DA2 = post.awayTeamD2;
            var DAname1 = "";
            var DAname2 = "";

            var playedUp = "Played Up";
            var noPlayer = "No Player";

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
                            for (i = 0; i < rows.length; i++) {
                                if (rows[i].userID == A) {
                                    Aname = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == B) {
                                    Bname = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == C) {
                                    Cname = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == X) {
                                    Xname = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == Y) {
                                    Yname = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == Z) {
                                    Zname = rows[i].firstName + " " + rows[i].lastName;
                                }
                            }
                            for (i = 0; i < rows.length; i++) {
                                if (rows[i].userID == DH1) {
                                    DHname1 = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == DH2) {
                                    DHname2 = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == DA1) {
                                    DAname1 = rows[i].firstName + " " + rows[i].lastName;
                                } else if (rows[i].userID == DA2) {
                                    DAname2 = rows[i].firstName + " " + rows[i].lastName;
                                }
                            }

                            if (C == "playedUp") {
                                Cname = playedUp;
                            } else if (C == "noPlayer") {
                                Cname = noPlayer;
                            }

                            if (Z == "playedUp") {
                                Zname = playedUp;
                            } else if (Z == "noPlayer") {
                                Zname = noPlayer;
                            }
                            if (DH2 == "playedUp") {
                                DHname2 = playedUp;
                            }
                            if (DA2 == "playedUp") {
                                DAname2 = playedUp;
                            }

                            res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                            res.write('<link rel="stylesheet" href="w3.css">');
                            res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                            res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                            res.write('<script type="application/javascript">parent.scrollTo(0,0);window.top.document.getElementById("submitscore").style.height = "50px";</script>');
                            res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');

                            res.write('<h3 class="w3-center">Enter Scores</h3>');
                            res.write('<form action="submitScorePost" method="post">');

                            //desktop & Tablet
                            res.write('<div class="w3-white w3-hide-small" style="padding:40px;">');
                            res.write('<table class="w3-table-all w3-card-4"><tr><th style="text-align:left" colspan="2">Home Team</th><th style="text-align:right" colspan="2">Away Team</th></tr>');
                            res.write('<tr><td style="width:1%">A</td><td style="width:49%;text-align:left">' + Aname + '</td><td style="width:49%;text-align:right">' + Xname + '</td><td style="width:1%">X</td></tr>');
                            res.write('<tr><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr><td style="vertical-align:middle">D</td><td style="text-align:left">' + DHname1 + '<br>' + DHname2 + '</td><td style="text-align:right">' + DAname1 + '<br>' + DAname2 + '</td><td style="vertical-align:middle">D</td></tr>');
                            res.write('</table><br>');
                            //desktop & Tablet      
                            res.write('<table class="w3-table-all w3-card-4"><tr><th style="text-align:center;width:1%">#</th><th style="text-align:left;width:44%">Home Team</th><th style="text-align:right;width:5%"></th><th style="text-align:left;width:5%"></th><th style="text-align:right;width:44%">Away Team</th><th style="text-align:center;width:1%">#</th></tr>');
                            res.write('<tr><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="AvX" value="' + A + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="AvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="BvY" value="' + B + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="BvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="CvZ" value="' + C + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="CvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="BvX" value="' + B + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="BvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="AvZ" value="' + A + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="AvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="CvY" value="' + C + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="CvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="BvZ" value="' + B + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="BvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="CvX" value="' + C + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="CvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input onclick="getScore()" class="w3-radio" type="radio" name="AvY" value="' + A + '" required></td><td><input onclick="getScore()" class="w3-radio" type="radio" name="AvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr><td style="vertical-align:middle">D</td><td style="text-align:left">' + DHname1 + '<br>' + DHname2 + '</td><td style="text-align:right;vertical-align:middle"><input onclick="getScore()" class="w3-radio" type="radio" name="DvD" value="' + A + '" required></td><td style="vertical-align:middle"><input onclick="getScore()" class="w3-radio" type="radio" name="DvD" value="' + X + '" required></td><td style="text-align:right">' + DAname1 + '<br>' + DAname2 + '</td><td style="vertical-align:middle">D</td></tr>');

                            res.write('<tr style="background-color:transparent;border:none"><td></td><td></td><td class="w3-card-4 w3-large w3-padding" id="tdHomeScore" style="text-align:center"></td><td style="text-align:center" id="tdAwayScore" class="w3-card-4 w3-large w3-padding" ></td><td></td><td></td></tr>');
                            res.write('</table>');

                            res.write('</div>');

                            //mobile
                            res.write('<div class="w3-white w3-hide-large w3-hide-medium" style="padding:5px;">');
                            res.write('<table class="w3-table-all w3-card-4"><tr class="w3-small"><th style="text-align:left" colspan="2">Home Team</th><th style="text-align:right" colspan="2">Away Team</th></tr>');
                            res.write('<tr class="w3-small"><td style="width:1%">A</td><td style="width:49%;text-align:left">' + Aname + '</td><td style="width:49%;text-align:right">' + Xname + '</td><td style="width:1%">X</td></tr>');
                            res.write('<tr class="w3-small"><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr class="w3-small"><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr class="w3-small"><td style="vertical-align:middle">D</td><td style="text-align:left">' + DHname1 + '<br>' + DHname2 + '</td><td style="text-align:right">' + DAname1 + '<br>' + DAname2 + '</td><td style="vertical-align:middle">D</td></tr>');
                            res.write('</table><br>');
                            //mobile          
                            res.write('<table class="w3-table-all w3-card-4"><tr class="w3-small"><th style="text-align:center;width:1%">#</th><th style="text-align:left;width:40%">Home Team</th><th style="text-align:right;width:9%"></th><th style="text-align:left;width:9%"></th><th style="text-align:right;width:40%">Away Team</th><th style="text-align:center;width:1%">#</th></tr>');
                            res.write('<tr class="w3-small"><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="AvX" value="' + A + '" required></td><td><input class="w3-radio" type="radio" name="AvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr class="w3-small"><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="BvY" value="' + B + '" required></td><td><input class="w3-radio" type="radio" name="BvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr class="w3-small"><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="CvZ" value="' + C + '" required></td><td><input class="w3-radio" type="radio" name="CvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr class="w3-small"><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="BvX" value="' + B + '" required></td><td><input class="w3-radio" type="radio" name="BvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr class="w3-small"><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="AvZ" value="' + A + '" required></td><td><input class="w3-radio" type="radio" name="AvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr class="w3-small"><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="CvY" value="' + C + '" required></td><td><input class="w3-radio" type="radio" name="CvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr class="w3-small"><td>B</td><td style="text-align:left">' + Bname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="BvZ" value="' + B + '" required></td><td><input class="w3-radio" type="radio" name="BvZ" value="' + Z + '" required></td><td style="text-align:right">' + Zname + '</td><td>Z</td></tr>');
                            res.write('<tr class="w3-small"><td>C</td><td style="text-align:left">' + Cname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="CvX" value="' + C + '" required></td><td><input class="w3-radio" type="radio" name="CvX" value="' + X + '" required></td><td style="text-align:right">' + Xname + '</td><td>X</td></tr>');
                            res.write('<tr class="w3-small"><td>A</td><td style="text-align:left">' + Aname + '</td><td style="text-align:right"><input class="w3-radio" type="radio" name="AvY" value="' + A + '" required></td><td><input class="w3-radio" type="radio" name="AvY" value="' + Y + '" required></td><td style="text-align:right">' + Yname + '</td><td>Y</td></tr>');
                            res.write('<tr class="w3-small"><td style="vertical-align:middle">D</td><td style="text-align:left">' + DHname1 + '<br>' + DHname2 + '</td><td style="text-align:right;vertical-align:middle"><input class="w3-radio" type="radio" name="DvD" value="' + A + '" required></td><td style="vertical-align:middle"><input class="w3-radio" type="radio" name="DvD" value="' + X + '" required></td><td style="text-align:right">' + DAname1 + '<br>' + DAname2 + '</td><td style="vertical-align:middle">D</td></tr>');

                            res.write('<tr style="background-color:transparent;border:none"><td></td><td></td><td class="w3-card-4 w3-padding" id="tdHomeScoreMob" style="text-align:center"></td><td style="text-align:center" id="tdAwayScoreMob" class="w3-card-4 w3-padding" ></td><td></td><td></td></tr>');
                            res.write('</table><br>');
                            res.write('</div>');

                            res.write('<script>var radioCheck1 = document.getElementsByName("CvZ");var radioCheck2 = document.getElementsByName("AvZ");var radioCheck3 = document.getElementsByName("CvY");var radioCheck4 = document.getElementsByName("CvX");var radioCheck5 = document.getElementsByName("BvZ");');

                            res.write('if (radioCheck1[0].value == "noPlayer" && radioCheck1[1].value == "noPlayer") { radioCheck1[0].checked = true;radioCheck1[1].disabled = true;} else if (radioCheck1[0].value == "noPlayer") { radioCheck1[1].checked = true;radioCheck1[0].disabled = true;} else if (radioCheck1[1].value == "noPlayer") { radioCheck1[0].checked = true;radioCheck1[1].disabled = true;}');
                            res.write('if (radioCheck2[0].value == "noPlayer") { radioCheck2[1].checked = true;radioCheck2[0].disabled = true;} else if (radioCheck2[1].value == "noPlayer") { radioCheck2[0].checked = true;radioCheck2[1].disabled = true;}');
                            res.write('if (radioCheck3[0].value == "noPlayer") { radioCheck3[1].checked = true;radioCheck3[0].disabled = true;} else if (radioCheck3[1].value == "noPlayer") { radioCheck3[0].checked = true;radioCheck3[1].disabled = true;}');
                            res.write('if (radioCheck4[0].value == "noPlayer") { radioCheck4[1].checked = true;radioCheck4[0].disabled = true;} else if (radioCheck4[1].value == "noPlayer") { radioCheck4[0].checked = true;radioCheck4[1].disabled = true;}');
                            res.write('if (radioCheck5[0].value == "noPlayer") { radioCheck5[1].checked = true;radioCheck5[0].disabled = true;} else if (radioCheck5[1].value == "noPlayer") { radioCheck5[0].checked = true;radioCheck5[1].disabled = true;}');

                            res.write('getScore()</script>');

                            res.write('<div class="w3-white w3-center" style="padding:0px 40px 15px 40px;">');

                            res.write('<input type="hidden" name="homeTeam" value="' + homeTeamID + '">');
                            res.write('<input type="hidden" name="awayTeam" value="' + awayTeamID + '">');

                            res.write('<input type="hidden" name="homeTeamName" value="' + post.homeTeamName + '">');
                            res.write('<input type="hidden" name="awayTeamName" value="' + post.awayTeamName + '">');

                            res.write('<input type="hidden" name="playerA" value="' + A + '">');
                            res.write('<input type="hidden" name="playerB" value="' + B + '">');
                            res.write('<input type="hidden" name="playerC" value="' + C + '">');
                            res.write('<input type="hidden" name="playerX" value="' + X + '">');
                            res.write('<input type="hidden" name="playerY" value="' + Y + '">');
                            res.write('<input type="hidden" name="playerZ" value="' + Z + '">');

                            res.write('<input type="hidden" name="playerAName" value="' + Aname + '">');
                            res.write('<input type="hidden" name="playerBName" value="' + Bname + '">');
                            res.write('<input type="hidden" name="playerCName" value="' + Cname + '">');
                            res.write('<input type="hidden" name="playerXName" value="' + Xname + '">');
                            res.write('<input type="hidden" name="playerYName" value="' + Yname + '">');
                            res.write('<input type="hidden" name="playerZName" value="' + Zname + '">');

                            res.write('<textarea class="w3-input" style="resize:none; width:525px" name="writeup" placeholder="Write a quick match writeup here... (' + post.homeTeamName + ' v ' + post.awayTeamName + ')"></textarea><br>');

                            res.write('<input id="submitBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Submit">');
                            res.write('</div></form></div>');

                            res.write('<script>function getScore() { var homeScore = 0;var awayScore = 0;var radioCheck1 = document.getElementsByName("AvX");var radioCheck2 = document.getElementsByName("AvY");var radioCheck3 = document.getElementsByName("AvZ");var radioCheck4 = document.getElementsByName("BvX");var radioCheck5 = document.getElementsByName("BvY");var radioCheck6 = document.getElementsByName("BvZ");var radioCheck7 = document.getElementsByName("CvX");var radioCheck8 = document.getElementsByName("CvY");var radioCheck9 = document.getElementsByName("CvZ");var radioCheck10 = document.getElementsByName("DvD");');

                            res.write('if (radioCheck1[0].checked) { homeScore++;} else if (radioCheck1[1].checked) { awayScore++;}');
                            res.write('if (radioCheck2[0].checked) { homeScore++;} else if (radioCheck2[1].checked) { awayScore++;}');
                            res.write('if (radioCheck3[0].checked) { homeScore++ } else if (radioCheck3[1].checked) { awayScore++;}');
                            res.write('if (radioCheck4[0].checked) { homeScore++;} else if (radioCheck4[1].checked) { awayScore++;}');
                            res.write('if (radioCheck5[0].checked) { homeScore++;} else if (radioCheck5[1].checked) { awayScore++;}');
                            res.write('if (radioCheck6[0].checked) { homeScore++;} else if (radioCheck6[1].checked) { awayScore++;}');
                            res.write('if (radioCheck7[0].checked) { homeScore++;} else if (radioCheck7[1].checked) { awayScore++;}');
                            res.write('if (radioCheck8[0].checked) { homeScore++;} else if (radioCheck8[1].checked) { awayScore++;}');
                            res.write('if (radioCheck9[0].checked) { homeScore++;} else if (radioCheck9[1].checked) { awayScore++;}');
                            res.write('if (radioCheck10[0].checked) { homeScore++;} else if (radioCheck10[1].checked) { awayScore++;}');
                            res.write('tdHomeScore.innerHTML = homeScore;tdAwayScore.innerHTML = awayScore;tdHomeScoreMob.innerHTML = homeScore;tdAwayScoreMob.innerHTML = awayScore;');
                            res.write('} getScore()</script>');

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

exports.pageDataPostSubmitScores = function (req, res) {

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

            var A = mysql.escape(post.playerA);
            var B = mysql.escape(post.playerB);
            var C = mysql.escape(post.playerC);

            var X = mysql.escape(post.playerX);
            var Y = mysql.escape(post.playerY);
            var Z = mysql.escape(post.playerZ);

            var Aname = mysql.escape(post.playerAName);
            var Bname = mysql.escape(post.playerBName);
            var Cname = mysql.escape(post.playerCName);

            var Xname = mysql.escape(post.playerXName);
            var Yname = mysql.escape(post.playerYName);
            var Zname = mysql.escape(post.playerZName);

            var AvX = mysql.escape(post.AvX);
            var AvY = mysql.escape(post.AvY);
            var AvZ = mysql.escape(post.AvZ);
            var BvX = mysql.escape(post.BvX);
            var BvY = mysql.escape(post.BvY);
            var BvZ = mysql.escape(post.BvZ);
            var CvX = mysql.escape(post.CvX);
            var CvY = mysql.escape(post.CvY);
            var CvZ = mysql.escape(post.CvZ);
            var DvD = mysql.escape(post.DvD);

            var homeTeamID = mysql.escape(post.homeTeam);
            var awayTeamID = mysql.escape(post.awayTeam);

            var homeTeamName = mysql.escape(post.homeTeamName);
            var awayTeamName = mysql.escape(post.awayTeamName);

            var homePoints = 0;
            var awayPoints = 0;
            var writeup = post.writeup;
            if (writeup.substring(writeup.length - 1) == ".") {
                writeup = writeup.substring(0, writeup.length - 1);
            }
            writeup = "(" + post.homeTeamName + " v " + post.awayTeamName + ") " + writeup + ". ";
            var prevMonday = new Date();
            prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
            day = prevMonday.getDate();
            day = ("0" + day).slice(-2);
            month = prevMonday.getMonth() + 1;
            month = ("0" + month).slice(-2);
            year = prevMonday.getFullYear();
            
            console.log(writeup);
            connection.connect();

            connection.query("UPDATE writeups SET message=CONCAT(message,'" + writeup + "') WHERE weekCommence = '"+year+"-"+month+"-"+day+"'",
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query. qwerty');
                    }
                });

            if (AvX == A) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'beat'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (AvX == X) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'lost to'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (AvY == A) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'beat'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (AvY == Y) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'lost to'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (AvZ == A) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'beat'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (AvZ == Z) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + A + "," + Aname + "," + homeTeamName + ",'lost to'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (AvZ == "playedUp") {
                awayPoints = awayPoints + 1;
            }

            if (BvX == B) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'beat'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (BvX == X) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'lost to'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (BvY == B) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'beat'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (BvY == Y) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'lost to'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (BvZ == B) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'beat'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (BvZ == Z) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + B + "," + Bname + "," + homeTeamName + ",'lost to'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (BvZ == "playedUp") {
                awayPoints = awayPoints + 1;
            }

            if (CvX == C) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'beat'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (CvX == "playedUp") {
                homePoints = homePoints + 1;
            } else if (CvX == X) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'lost to'," + X + "," + Xname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (CvY == C) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'beat'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (CvY == "playedUp") {
                homePoints = homePoints + 1;
            } else if (CvY == Y) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'lost to'," + Y + "," + Yname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            }

            if (CvZ == C) {
                homePoints = homePoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'beat'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (CvZ == "playedUp") {
                homePoints = homePoints + 1;
            } else if (CvZ == Z) {
                awayPoints = awayPoints + 1;
                connection.query("INSERT INTO playerResults (homePlayer, homePlayerName, homeTeam, result, awayPlayer, awayPlayerName, awayTeam) VALUES (" + C + "," + Cname + "," + homeTeamName + ",'lost to'," + Z + "," + Zname + "," + awayTeamName + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (CvZ == "playedUp") {
                awayPoints = awayPoints + 1;
            }

            if (DvD == A) {
                homePoints = homePoints + 1;
            } else if (DvD == X) {
                awayPoints = awayPoints + 1;
            }

            connection.query("UPDATE user SET gamesPlayed = gamesPlayed+3 WHERE userID = " + A + " OR userID = " + B + " OR userID = " + C,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });
            connection.query("UPDATE user SET gamesPlayed = gamesPlayed+3 WHERE userID = " + X + " OR userID = " + Y + " OR userID = " + Z,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });


            connection.query("UPDATE user SET wins = wins+1 WHERE userID = " + AvX + " OR userID = " + BvY + " OR userID = " + CvZ,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });
            connection.query("UPDATE user SET wins = wins+1 WHERE userID = " + BvX + " OR userID = " + AvZ + " OR userID = " + CvY,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });
            connection.query("UPDATE user SET wins = wins+1 WHERE userID = " + BvZ + " OR userID = " + CvX + " OR userID = " + AvY,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });


            connection.query("UPDATE teams SET teamGamesPlayed = teamGamesPlayed+1 WHERE teamID = " + homeTeamID + " OR teamID = " + awayTeamID,
                function (err) {
                    if (err) { //error
                        console.log('Error while performing Query.');
                    }
                });


            if (homePoints == awayPoints) {
                connection.query("UPDATE teams SET teamDraws = teamDraws+1 WHERE teamID = " + homeTeamID + " OR teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET points = points+5 WHERE teamID = " + homeTeamID + " OR teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("INSERT INTO teamResults (homeTeam, homeTeamName, result, awayTeam, awayTeamName, homeScore, awayScore) VALUES (" + homeTeamID + "," + homeTeamName + ",'drew to'," + awayTeamID + "," + awayTeamName + "," + homePoints + "," + awayPoints + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (homePoints < awayPoints) {
                connection.query("UPDATE teams SET teamWins = teamWins+1 WHERE teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET teamLosses = teamLosses+1 WHERE teamID = " + homeTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET points = points+" + awayPoints + " WHERE teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET points = points+" + homePoints + " WHERE teamID = " + homeTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("INSERT INTO teamResults (homeTeam, homeTeamName, result, awayTeam, awayTeamName, homeScore, awayScore) VALUES (" + homeTeamID + "," + homeTeamName + ",'lost to'," + awayTeamID + "," + awayTeamName + "," + homePoints + "," + awayPoints + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                        }
                    });
            } else if (homePoints > awayPoints) {
                connection.query("UPDATE teams SET teamWins = teamWins+1 WHERE teamID = " + homeTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET teamLosses = teamLosses+1 WHERE teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET points = points+" + homePoints + " WHERE teamID = " + homeTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("UPDATE teams SET points = points+" + awayPoints + " WHERE teamID = " + awayTeamID,
                    function (err) {
                        if (err) { //error
                            console.log('Error while performing Query.');
                        }
                    });
                connection.query("INSERT INTO teamResults (homeTeam, homeTeamName, result, awayTeam, awayTeamName, homeScore, awayScore) VALUES (" + homeTeamID + "," + homeTeamName + ",'beat'," + awayTeamID + "," + awayTeamName + "," + homePoints + "," + awayPoints + ")",
                    function (err) {
                        if (err) {
                            console.log('Error while performing Query.');
                            console.log(err);
                        }
                    });
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
            res.write('<link rel="stylesheet" href="w3.css">');
            res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
            res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
            res.write('<script type="application/javascript">parent.scrollTo(0,0);window.top.document.getElementById("submitscore").style.height = "225px"</script>');
            res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');

            res.write('<br><br><h3 class="w3-center">Success!</h3><br><br>');
            res.write('</div>');
            connection.end();
            res.end();
        });
    }

}
