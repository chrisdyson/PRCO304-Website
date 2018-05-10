var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataEditEmailPost = function (req, res) {

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
}

exports.pageDataEditPhonePost = function (req, res) {

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
            connection.query("UPDATE user SET phone = " + mysql.escape(post.phone) + " WHERE username = " + mysql.escape(post.username),
                function (err, rows, fields) {
                    if (!err) {
                        connection.end();
                        res.write('<script>window.top.location.href = "/profile";</script>');
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

exports.pageDataEditPasswordPost = function (req, res) {

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
            
            //----------------------------------------------------------
            //HASHING PASSWORDS
            
            //var bcrypt = require('bcrypt'); //require NodeJS Module
            
            //ON SIGNUP/ PASSWORD CHANGE
            //Generate a salt
            //var salt = bcrypt.genSaltSync(10);
            //Hash the password with the salt
            //var hash = bcrypt.hashSync(post.password, salt);
            //Save hash to DB

            //ON LOGIN
            //Load the password hash from DB
            //Let's assume it's stored in a variable called `hash`
            //bcrypt.compareSync("my password", hash); // true
            //bcrypt.compareSync("not my password", hash); // false
            //----------------------------------------------------------

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

}
