var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
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

}
