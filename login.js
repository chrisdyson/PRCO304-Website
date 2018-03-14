var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataViewLogin = function (req, res) {

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

}

exports.pageDataPostLogin = function (req, res) {

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

}
