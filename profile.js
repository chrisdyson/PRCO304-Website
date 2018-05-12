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
    var username = req.query.u;

    connection.query("SELECT * FROM user,teams,clubs WHERE user.teamID=teams.teamID AND teams.clubID = clubs.clubID AND user.username=" + mysql.escape(username),
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
                    res.write('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>');
                    res.write('<style type="text/css">#editEmailIcon:hover{color:#ff4d4d;cursor:pointer} #editPhoneIcon:hover{color:#ff4d4d;cursor:pointer} #subEditEBtn{border-bottom: solid 1px #ccc;transition: border 300ms ease-in-out;} #txtEmail:focus + #subEditEBtn{border-bottom: solid 1px #999999} #subEditPBtn{border-bottom: solid 1px #ccc;transition: border 300ms ease-in-out;} #txtPhone:focus + #subEditPBtn{border-bottom: solid 1px #999999}#subEditPasswordBtn{border-bottom: solid 1px #ccc;transition: border 300ms ease-in-out;} #txtPassword:focus + #subEditPasswordBtn{border-bottom: solid 1px #999999}</style>');

                    res.write('<script>function openEmailEditor() { $("#divEmail").hide();$("#divEmailChange").show();} function openPhoneEditor() { $("#divPhone").hide();$("#divPhoneChange").show();} window.onload = function() {$(".hiddenusername").val(localStorage.username)}</script>');
                    res.write('<div class="w3-container w3-card-4" style="width:80%;margin: 0 auto;">');

                    for (i = 0; i < rows.length; i++) {
                        var dob = "" + rows[i].dateOfBirth; //date of birth with extra date stuff at end
                        var convDob = dob.substr(0, 15); //date of birth with extra stuff removed
                        res.write('<h3>' + rows[i].firstName + ' ' + rows[i].lastName + '</h3>');

                        res.write('<p><div style="display:block" id="divEmail">' + rows[i].email + '&nbsp;&nbsp;&nbsp;<span onclick="openEmailEditor()"><i id="editEmailIcon" class="fa fa-pencil"></i></span></div><div id="divEmailChange" style="display:none"><form action="editProfileEmail" method="post"><input type="hidden" class="hiddenusername" name="username" value=""><input style="width:200px" id="txtEmail" class="w3-left w3-input" placeholder="Change Email..." type="email" name="email" autocomplete="off" required><input id="subEditEBtn" class="w3-center w3-button w3-ripple w3-white" type="submit" value="Edit"></form></div></p>');

                        res.write('<p><div style="display:block" id="divPhone">' + rows[i].phone + '&nbsp;&nbsp;&nbsp;<span onclick="openPhoneEditor()"><i id="editPhoneIcon" class="fa fa-pencil"></i></span></div><div id="divPhoneChange" style="display:none"><form action="editProfilePhone" method="post"><input type="hidden" class="hiddenusername" name="username" value=""><input style="width:200px" id="txtPhone" class="w3-left w3-input" maxlength="11" placeholder="Change Phone..." type="tel" name="phone" autocomplete="off" required oninput="this.value = this.value.replace(/[^0-9.]/g, \'\');"><input id="subEditPBtn" class="w3-center w3-button w3-ripple w3-white" type="submit" value="Edit"></form></div></p>');
                        
                        res.write('<p><form action="editProfilePassword" method="post"><input type="hidden" class="hiddenusername" name="username" value=""><input style="width:200px" id="txtPassword" class="w3-left w3-input" placeholder="Change Password..." type="password" name="password" autocomplete="off" required><input id="subEditPasswordBtn" class="w3-center w3-button w3-ripple w3-white" type="submit" value="Edit"></form></p><p style="display:none" id="lblUpdatePassMessage" class="w3-tag w3-padding w3-round-large w3-red w3-center">You still have the default password, please update this immediately for security reasons!</p>');
                        if (rows[i].password == "pass") {
                            res.write('<script>document.getElementById("lblUpdatePassMessage").style.display = "block";</script>');
                        } else {
                            res.write('<script>document.getElementById("lblUpdatePassMessage").style.display = "none";</script>');
                        }
                        res.write('<p>' + convDob + '</p>');
                    }
                    res.write('</div><br>');

                    if (rows[0].userType == "Admin") {
                        res.write('<div style="width:80%;margin: 0 auto;"><span id="btnViewAdmin" onclick="window.top.location.href=\'admin\'" style="background-color:#f1f1f1;cursor:pointer;padding: 12px 20px;" class="w3-center w3-card-4">View Admin Panel</span></div><br>');
                        res.write('<script>$("#btnViewAdmin").hover(function(){$(this).animate({"backgroundColor": "#525252","color":"#f2f2f2"},350);},function(){$(this).animate({"backgroundColor": "#f1f1f1","color":"#000"},350);});</script>');
                    }

                    for (i = 0; i < rows.length; i++) {
                        var percent = rows[i].percentage;
                        if (percent == null) {
                            var percentConv = 0;
                        } else {
                            var percentConv = percent.toFixed(2);
                        }

                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center" colspan="3" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">' + rows[i].username + ' (Div ' + rows[i].division + ') </th></tr>');
                        res.write('<tr><th class="w3-center" style="width:33%">Played</th><th class="w3-center" style="width:33%">Wins</th><th class="w3-center" style="width:33%">Win %</th></tr>');
                        res.write('<tr><td class="w3-center">' + rows[i].gamesPlayed + '</td><td class="w3-center">' + rows[i].wins + '</td><td class="w3-center">' + percentConv + '%</td></tr>');
                        res.write('</table>');
                        res.write('<br>');
                        res.write('<table style="width: 80%;margin: 0 auto;" class="w3-table-all w3-card-4 w3-center">');
                        res.write('<tr><th class="w3-center" colspan="5" style="width:100%;background-color:#f1f1f1;padding-bottom:10px">' + rows[i].clubName + ' ' + rows[i].teamName + '</th></tr>');
                        res.write('<tr class="w3-hide-small"><th class="w3-center" style="width: calc(100% / 5);">Played</th><th class="w3-center" style="width: calc(100% / 5);">Wins</th><th class="w3-center" style="width: calc(100% / 5);">Draws</th><th class="w3-center" style="width: calc(100% / 5);">Losses</th><th class="w3-center" style="width: calc(100% / 5);">Points</th></tr>');
                        res.write('<tr style="background-color: #f1f1f1;" class="w3-hide-large w3-hide-medium"><th class="w3-center" style="width: calc(100% / 5);">P</th><th class="w3-center" style="width: calc(100% / 5);">W</th><th class="w3-center" style="width: calc(100% / 5);">D</th><th class="w3-center" style="width: calc(100% / 5);">L</th><th class="w3-center" style="width: calc(100% / 5);">Pts</th></tr>');
                        res.write('<tr style="background-color: #fff;"><td class="w3-center">' + rows[i].teamGamesPlayed + '</td><td class="w3-center">' + rows[i].teamWins + '</td><td class="w3-center">' + rows[i].teamDraws + '</td><td class="w3-center">' + rows[i].teamLosses + '</td><td class="w3-center">' + rows[i].points + '</td></tr>');
                        res.write('</table>');
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
