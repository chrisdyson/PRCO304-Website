var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var request = require('superagent');

var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageData = function (req, res) {

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
    connection.query("SELECT * FROM user ORDER BY lastName",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                    res.write('<script>function ConfirmDelete(){var x = confirm("Are you sure you want to delete all of the seasons current data? This action cannot be undone!");if (x) return true; else event.preventDefault();}</script>');
                    res.write('<div class="w3-container w3-card-4" style="width:85%;margin: 0 auto;">');
                    if (userType == "Admin") {
                        res.write('<h3 class="w3-center">Season Reset</h3>');
                        res.write('<form action="resetSeason" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Confirm you want to delete all current season data <span class="w3-text-red">*</span></b><br> <input class="w3-check" type="checkbox" required><br><br>');

                        res.write('<input id="deleteBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Delete" onclick="ConfirmDelete()">');
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

}

exports.pageDataPost = function (req, res) {

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
            connection.query("TRUNCATE TABLE playerResults",
                function (err, rows, fields) {
                    if (!err) {
                        connection.query("TRUNCATE TABLE teamResults",
                            function (err, rows, fields) {
                                if (!err) {
                                    connection.query("UPDATE teams SET teamGamesPlayed = 0, teamWins = 0, teamDraws = 0, teamLosses = 0, points = 0",
                                        function (err, rows, fields) {
                                            if (!err) {
                                                connection.query("UPDATE user SET gamesPlayed = 0, wins = 0",
                                                    function (err, rows, fields) {
                                                        if (!err) {
                                                            connection.query("TRUNCATE TABLE writeups",
                                                                function (err, rows, fields) {
                                                                    if (!err) {
                                                                        connection.end();
                                                                        res.write('<script>window.top.location.href = "/admin";</script>');
                                                                        return res.end();
                                                                    } else { //error
                                                                        console.log('Error while performing Query.');
                                                                        res.write('There was an error deleting the data.');
                                                                        res.end();
                                                                        connection.end();
                                                                    }
                                                                });
                                                        } else { //error
                                                            console.log('Error while performing Query.');
                                                            res.write('There was an error deleting the data.');
                                                            res.end();
                                                            connection.end();
                                                        }
                                                    });
                                            } else { //error
                                                console.log('Error while performing Query.');
                                                res.write('There was an error deleting the data.');
                                                res.end();
                                                connection.end();
                                            }
                                        });
                                } else { //error
                                    console.log('Error while performing Query.');
                                    res.write('There was an error deleting the data.');
                                    res.end();
                                    connection.end();
                                }
                            });
                    } else { //error
                        console.log('Error while performing Query.');
                        res.write('There was an error deleting the data.');
                        res.end();
                        connection.end();
                    }
                });
        });
    }

}
