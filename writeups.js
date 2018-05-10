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
    connection.query("SELECT * FROM writeups ORDER BY weekCommence DESC",
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
                    res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');
                    res.write('<h3 class="w3-center">Weekly Writeups</h3>');
                    for (i = 0; i < rows.length; i++) {
                        var wcDate = String(rows[i].weekCommence).slice(0, -24);
                        res.write('<p>W/C <b>' + wcDate + '</b><br><span class="w3-hide-small">' + rows[i].message + '</span><span class="w3-hide-medium w3-hide-large w3-small">' + rows[i].message + '</span></p>');
                    }
                    res.write('</div>');
                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the writeups data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the writeups data");
                res.end();
            }
        });

}
