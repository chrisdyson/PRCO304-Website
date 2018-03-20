var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var request = require('superagent');

var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

var mailchimpInstance = 'us17',
    listUniqueId = '5c25f14a2e',
    mailchimpApiKey = '13b067c971e95a96e807a776f2d753db-us17';

exports.pageDataCreateProfile = function (req, res) {

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
                        res.write('<h3 class="w3-center">Create User</h3>');
                        res.write('<form action="addProfile" method="post">');
                        res.write('<div class="w3-white" style="padding:40px;">');
                        res.write('<b>Username <span class="w3-text-red">*</span></b> <input id="txtCreateUsername" class="w3-input w3-left" type="text" name="username" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>First Name <span class="w3-text-red">*</span></b> <input id="txtCreateFName" class="w3-input w3-left" type="text" name="firstName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Last Name <span class="w3-text-red">*</span></b> <input id="txtCreateLName" class="w3-input w3-left" type="text" name="lastName" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Email <span class="w3-text-red">*</span></b> <input id="txtCreateEmail" class="w3-input w3-left" type="email" name="email" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>D.o.B <span class="w3-text-red">*</span></b> <input id="inputCreateDob" class="w3-input w3-left w3-white" type="date" name="dob" autocomplete="off" required><br><br><br><br>');
                        res.write('<b>Team </b><br> <select class="w3-select w3-white" name="team" autocomplete="off">');
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

}

exports.pageDataCreateProfilePost = function (req, res) {

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

            var username = mysql.escape(post.username);
            var email = mysql.escape(post.email);
            var firstName = mysql.escape(post.firstName);
            var lastName = mysql.escape(post.lastName);
            var dob = mysql.escape(post.dob);
            var team = mysql.escape(post.team);

            connection.connect();
            connection.query("INSERT INTO user (username, email, password, firstName, lastName, dateOfBirth, teamID, gamesPlayed, wins) VALUES (" + username + "," + email + ", 'pass'," + firstName + "," + lastName + "," + dob + "," + team + ", 0, 0 )",
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();

                        res.write('<script>location.href = "/addProfileMailChimp?e='+post.email+'&u='+post.username+'&f='+post.firstName+'&l='+post.lastName+'";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query. qwerty');
                        res.end();
                        connection.end();
                    }
                });
        });
    }

}

exports.pageDataMailChimpPost = function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': req.query.e,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': req.query.f,
                'USERNAME': req.query.u,
                'LNAME': req.query.l
            }
        })
        .end(function (err, response) {
            if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                //res.send('Signed Up!');
                res.write('<script>window.top.location.href = "/admin";</script>');
            } else {
                //res.send('Sign Up Failed :(');
                res.write('<script>window.top.location.href = "/admin";</script>');
            }
        });
}

exports.pageDataDeleteProfile = function (req, res) {

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

}

exports.pageDataDeleteProfilePost = function (req, res) {

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
            connection.query("DELETE FROM user WHERE userID = " + mysql.escape(post.user),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/admin";</script>');
                        return res.end();
                    } else { //error
                        console.log('Error while performing Query.');
                        res.write('There was an error deleting this user. Make sure they haven\'t already been deleted or that they are a captain');
                        res.end();
                        connection.end();
                    }
                });
        });
    }

}
