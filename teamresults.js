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
    var team = req.query.t;
    connection.connect();
    connection.query("SELECT * FROM teams, clubs, teamResults WHERE teams.teamID = "+team+" AND teams.clubID = clubs.clubID AND (teamResults.awayTeam = "+team+" OR teamResults.homeTeam = " + team +")",
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
                    res.write('<br><br>');
                    res.write('<table style="width: 75%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                    res.write('<tr class="w3-light-grey"><th style="vertical-align:middle;padding:20px" class="w3-left w3-xlarge w3-hide-small">Results for: ' + rows[0].clubName + ' ' + rows[0].teamName + '</th></tr>');
                    res.write('<tr class="w3-light-grey"><th style="vertical-align:middle;padding:20px" class="w3-left w3-large w3-hide-medium w3-hide-large">Results for: ' + rows[0].clubName + ' ' + rows[0].teamName + '</th></tr>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<tr class="w3-white"><td style="vertical-align:middle;padding:15px" class="w3-left"><a target="_parent" href="/viewResults?id=t'+rows[i].homeTeam+'">' + rows[i].homeTeamName + '</a>  <b>' + rows[i].result + '</b>  <a target="_parent" href="/viewResults?id=t'+rows[i].awayTeam+'">' + rows[i].awayTeamName + '</a> (' + rows[i].homeScore + '-' + rows[i].awayScore + ')</td></tr>')
                    }
                    res.write('</table><br><br>');
                    res.end();
                    connection.end();
                } else { //error - no data
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
                    res.write('<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>');
                    res.write('<br><br>');
                    res.write('<table style="width: 75%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                    res.write('<tr><td style="vertical-align:middle;padding:15px" class="w3-left">No data yet</td></tr>')
                    res.write('</table><br><br>');
                    res.end();
                    connection.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the user data");
                res.end();
            }
        });

}
