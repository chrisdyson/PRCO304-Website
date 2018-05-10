var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataViewMessages = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    connection.query("SELECT * FROM messages ORDER BY postDate DESC LIMIT 15",
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
}

exports.pageDataNewMessage = function (req, res) {

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

}

exports.pageDataNewMessagePost = function (req, res) {

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
}

exports.pageDataViewNewsHomepage = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    connection.query("SELECT * FROM messages ORDER BY postDate DESC LIMIT 3",
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
                    res.write('<div class="w3-container w3-card-4" style="width:95%;margin: 0 auto;">');
                    res.write('<h3 class="w3-center">Latest News</h3>');
                    for (i = 0; i < rows.length; i++) {
                        var pDate = String(rows[i].postDate).slice(0, -18);
                        res.write('<p>Posted: <b>' + pDate + '</b><br><span class="w3-hide-small">' + rows[i].message + '</span><span class="w3-hide-medium w3-hide-large w3-small">' + rows[i].message + '</span></p>');
                    }
                    res.write('<p><a target="_parent" href="news">View all Messages</a></p>');
                    res.write('</div>');
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
}