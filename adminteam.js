var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataCreateTeam = function (req, res) {

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

}

exports.pageDataCreateTeamPost = function (req, res) {

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

}

exports.pageDataDeleteTeam = function (req, res) {

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

}

exports.pageDataDeleteTeamPost = function (req, res) {

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

}

exports.pageDataAssignCaptain = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();

    connection.query("SELECT * FROM teams, clubs WHERE teams.clubID = clubs.clubID ORDER BY clubName",
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

                    res.write('<h3 class="w3-center">Assign Team Captain</h3>');
                    res.write('<form action="assignCaptainSelect" method="post">');
                    res.write('<div class="w3-white" style="padding:40px;">');
                    res.write('<b>Team <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="team" autocomplete="off" required>');
                    res.write('<option value="" disabled selected>Select...</option>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<option value="' + rows[i].teamID + '">' + rows[i].clubName + ' ' + rows[i].teamName + '</option>');
                    }
                    res.write('</select><br><br>');
                    res.write('<input id="setBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Next">');

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

exports.pageDataAssignCaptainSelectPost = function (req, res) {

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

            var team = post.team;

            connection.connect();
            connection.query("SELECT * FROM user WHERE teamID = " + team + " ORDER BY firstName",
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

                            res.write('<h3 class="w3-center">Assign Team Captain</h3>');
                            res.write('<form action="assignCaptain" method="post">');
                            res.write('<div class="w3-white" style="padding:40px;">');
                            res.write('<b>User <span class="w3-text-red">*</span></b><br> <select class="w3-select w3-white" name="user" autocomplete="off" required>');
                            res.write('<option value="" disabled selected>Select...</option>');
                            for (i = 0; i < rows.length; i++) {
                                res.write('<option value="' + rows[i].userID + '">' + rows[i].firstName + ' ' + rows[i].lastName + '</option>');
                            }
                            res.write('</select><br><br>');
                            res.write('<input type="hidden" id="hiddenName" name="team" value="' + team + '">');
                            res.write('<b>Confirm <span class="w3-text-red">*</span></b><br> <input class="w3-check" type="checkbox" required><br><br>');
                            res.write('<input id="setBtn" class="w3-center w3-button w3-ripple w3-light-grey" type="submit" value="Update">');

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

exports.pageDataAssignCaptainPost = function (req, res) {

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
            connection.query("UPDATE teams SET captain = " + mysql.escape(post.user) + " WHERE teamID = " + mysql.escape(post.team),
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

}
