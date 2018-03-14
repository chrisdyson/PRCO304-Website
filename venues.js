var settings = require('./headers');

var mysql = settings.mysql;
var qs = settings.qs;
var dbHost = settings.dbHost;
var dbUser = settings.dbUser;
var dbPassword = settings.dbPassword;
var dbDatabase = settings.dbDatabase;

exports.pageDataView = function (req, res) {

    var connection = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase
    });
    connection.connect();
    connection.query("SELECT * FROM clubs ORDER BY clubName;",
        function (err, rows, fields) {
            if (!err) {
                if (rows != '') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">');
                    res.write('<link rel="stylesheet" href="w3.css">');
                    res.write('<table style="width: 95%;margin: 0 auto;" class="w3-table-all w3-card-4"><tr><th style="width:50%">Club</th><th style="width:50%">Location</th></tr>');
                    for (i = 0; i < rows.length; i++) {
                        res.write('<tr><td>' + rows[i].clubName + '</td><td>' + rows[i].clubLocation + '</td></tr>');
                    }
                    res.write('</table>');
                    res.write('<br>')
                    res.write('<script>function initMap() {')
                    res.write('var mapOptions = {center: new google.maps.LatLng(50.379946, -4.139527),zoom: 13,mapTypeId: google.maps.MapTypeId.HYBRID};')
                    res.write('var map = new google.maps.Map(document.getElementById("map"), mapOptions);');
                    res.write('var markers = [];var contents = [];var infowindows = [];')

                    var j = 0;
                    for (; rows[j];) {
                        res.write('markers[' + j + '] = new google.maps.Marker({position: new google.maps.LatLng(' + rows[j].clubLat + ', ' + rows[j].clubLong + '),map: map});');
                        res.write('markers[' + j + '].index = ' + j + ';contents[' + j + '] = "' + rows[j].clubMapLabel + '";');
                        res.write('infowindows[' + j + '] = new google.maps.InfoWindow({content: contents[' + j + '],maxWidth: 300});');
                        res.write('google.maps.event.addListener(markers[' + j + '], "click", function () {infowindows[this.index].open(map, markers[this.index]);map.panTo(markers[this.index].getPosition())});');
                        j++;
                    }

                    res.write('} </script>');
                    res.write('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtssf_r1Vdlc8hqU7VE-ThqgabZ-4rE2I&callback=initMap"></script>');
                    res.write('<div class="w3-round-large w3-card-4" style="height: 600px;width: 95%;margin: 0 auto;" id="map"></div>');
                    res.end();
                    connection.end();
                } else { //error - no data
                    console.log('Error while performing Query.');
                    connection.end();
                    res.write("Sorry, there was an error retrieving the venues data");
                    res.end();
                }
            } else { //error
                console.log('Error while performing Query.');
                connection.end();
                res.write("Sorry, there was an error retrieving the venues data");
                res.end();
            }
        });

}
