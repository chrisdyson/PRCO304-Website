var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataAverages = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    connection.query("SELECT * FROM user,teams,clubs,league WHERE user.teamID=teams.teamID AND teams.clubID = clubs.clubID AND clubs.leagueID = league.leagueID ORDER BY division ASC, percentage DESC, firstName ASC",
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
                                res.write('<tr><td style="vertical-align:middle" class="w3-center">' + pos + '</td><td style="vertical-align:middle" class="w3-center w3-small w3-hide-medium w3-hide-large"><a target="_parent" href="/viewResults?id=u'+rows[i].userID+'">' + rows[i].firstName + ' ' + rows[i].lastName + '</a></td><td style="vertical-align:middle" class="w3-center w3-hide-small"><a target="_parent" href="/viewResults?id=u'+rows[i].userID+'">' + rows[i].firstName + ' ' + rows[i].lastName + '</a></td><td style="vertical-align:middle" class="w3-center w3-hide-small"><a target="_parent" href="/viewResults?id=t'+rows[i].teamID+'">' + rows[i].clubName + ' ' + rows[i].teamName + '</a></td><td style="vertical-align:middle" class="w3-center">' + rows[i].gamesPlayed + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].wins + '</td><td style="vertical-align:middle" class="w3-center">' + percentConv + '%</td></tr>');
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

}

exports.pageDataResults = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
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
                                res.write('<tr><td style="vertical-align:middle" class="w3-center">' + pos + '</td><td style="vertical-align:middle" class="w3-center"><a target="_parent" href="/viewResults?id=t'+rows[i].teamID+'">' + rows[i].clubName + ' ' + rows[i].teamName + '</a></td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamGamesPlayed + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamWins + '</td><td class="w3-center" style="vertical-align:middle">' + rows[i].teamDraws + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].teamLosses + '</td><td style="vertical-align:middle" class="w3-center">' + rows[i].points + '</td></tr>');
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

}
