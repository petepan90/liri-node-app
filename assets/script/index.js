// // Load the NPM Package inquirer
var reqInquirer = require("inquirer");
var weather = require("weather-js");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var moment = require("moment");

var weatherInputArray = [];

function splash() {

    reqInquirer
        .prompt([

            {
                type: "list",
                message: "\n\n\n\n        Would you like to Search: \n\n  A Song on Spotify, \n   An Artist's Concert, \n     A Movie's Info,\n or 'do-what-it-says'?\n\n",
                choices: ["• Spotify", "• Concert", "• Movie", "• Do-what-it-says\n"],
                name: "choice"
            }

        ]).then(function (inquirerResponse) {
            switch (inquirerResponse.choice) {
                case ("• Spotify"):
                    spotifySearch();
                    break;

                case ("• Concert"):
                    concertSearch();
                    break;

                case ("• Movie"):
                    movieSearch();
                    break;

                case ("• Do-what-it-says\n"):
                    doWhatSearch();
                    break;
            }






            /////////////////////////////////////////////////////////////////////////////////////////////////
            function spotifySearch() {
                reqInquirer
                    .prompt([{
                        type: "input",
                        message: "\n\n  Search by Song...",
                        name: "songinput"
                    }]).then(function (inquirerResponse) {


                        var spotify = new Spotify({
                            id: 'c829051a3ebf48c6a7067aefba76e5ec',
                            secret: 'ed3398814817417bb59fa77cea8a26d1'
                        });

                        spotify.search({
                            type: 'track',
                            query: inquirerResponse.songinput,
                            limit: "3"
                        }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }
                            //console.log(JSON.stringify(data, null, 2));
                            console.log("\n Artist(s)/Band: " + data.tracks.items[0].album.artists[0].name);
                            console.log("      Song Title: " + data.tracks.items[0].name);
                            console.log("         Album: " + data.tracks.items[0].album.name);
                            console.log(" Original Released: " + data.tracks.items[0].album.release_date + "\n\n");
                            //////////////--------------------////////
                            reqInquirer
                                .prompt([{
                                    type: "confrim",
                                    message: "  \n\n    Would you like to make another Search? - y/n\n\n",
                                    name: "research",
                                }]).then(function (inquirerResponse) {

                                    if (inquirerResponse.research === "y") {
                                        splash();

                                    } else {
                                        console.log("\n\n\n             Thanks for your time-\n\n\n");
                                    };
                                });
                            //////////////--------------------////////   
                        });
                    })
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////

            function concertSearch() {
                reqInquirer
                    .prompt([{
                        type: "input",
                        message: "\n\n  Search by Artist/Band...",
                        name: "bandinput"
                    }]).then(function (inquirerResponse) {

                        var p = inquirerResponse.bandinput.trim();
                        var regex = / /gi;
                        var up = (p.replace(regex, '+'))
                        var bitURL = "https://rest.bandsintown.com/artists/" + up + "/events?app_id=codingbootcamp";

                        request(bitURL, function (error, response, body) {
                            // If the request is successful
                            if (!error && response.statusCode === 200) {

                                var city = JSON.parse(body)[0].venue.city;
                                var state = JSON.parse(body)[0].venue.region;

                                weather.find({
                                    search: city + ", " + state,
                                    degreeType: "F"
                                }, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log("   Current Concert Conditions: " + result[0].current.skytext + " - " + result[0].current.temperature + "℉");

                                });

                                var trainFtime = JSON.parse(body)[0].datetime;
                                const firstTimeConverted = moment(trainFtime).format("llll");


                                console.log(JSON.parse(body)[0].venue.name);
                                console.log("   " + firstTimeConverted);
                                console.log("       " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country);
                            }
                            console.log("\n \n      Hit the up arrow, one time (when you're done reading)\n\n");
                        });
                        ////////////-----------------//////////
                        reqInquirer
                            .prompt([{
                                type: "confrim",
                                message: "  \n\n    Would you like to make another Search? - y/n\n\n",
                                name: "research",
                            }]).then(function (inquirerResponse) {

                                if (inquirerResponse.research === "y") {
                                    splash();

                                } else {
                                    console.log("\n\n\n             Thanks for your time- \n\n\n");
                                };
                            });
                        //////////////--------------------////////          
                    })
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////

            function movieSearch() {
                reqInquirer
                    .prompt([{
                        type: "input",
                        message: "\n\n  Search by Movie Title...",
                        name: "movieinput"
                    }]).then(function (inquirerResponse) {

                        var p = inquirerResponse.movieinput.trim();
                        var regex = / /gi;
                        console.log(p.replace(regex, '+'));

                        ////////////////////////////////////////////////////////////

                        var queryUrl = "http://www.omdbapi.com/?t=" + p + "&y=&plot=short&apikey=trilogy";

                        ////////////////////////////////////////////////////////////

                        request(queryUrl, function (error, response, body) {

                            // If the request is successful
                            if (!error && response.statusCode === 200) {

                                console.log("\n\n Movie Title: " + JSON.parse(body).Title);
                                console.log("  Date Released: " + JSON.parse(body).Year);
                                console.log("    IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                                console.log("     Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                                console.log("      Country Origin: " + JSON.parse(body).Country);
                                console.log("        Langauge: " + JSON.parse(body).Language);
                                console.log("          Main Actors: " + JSON.parse(body).Actors);
                                console.log("\n Plot: " + JSON.parse(body).Plot);
                            }
                            console.log("\n \n      Hit the up arrow once (when you're done reading)\n\n");

                        });
                        //////////////--------------------////////
                        reqInquirer
                            .prompt([{
                                type: "confrim",
                                message: "  \n\n    Would you like to make another Search? - y/n\n\n",
                                name: "research",
                            }]).then(function (inquirerResponse) {

                                if (inquirerResponse.research === "y") {
                                    splash();

                                } else {
                                    console.log("\n\n\n             Thanks for your time-\n\n\n");
                                };
                            });
                        //////////////--------------------////////
                    })
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////

            function doWhatSearch() {


                fs.readFile("random.txt", "utf8", function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var output = data.split(",");

                    // Loop Through the newly created output array
                    for (var i = 0; i < output.length; i++) {

                        // Print each element (item) of the array/
                        var firstArg = output[0];
                        var secondArg = output[1];
                    }

                    if (firstArg === "spotify") {

                        var spotify = new Spotify({
                            id: '9d91be7d0e1949279e4d86db1042c55e',
                            secret: 'bb449f23d2df4c1d90f8d1c66a1be60a'
                        });

                        spotify.search({
                            type: 'track',
                            query: secondArg,
                            limit: "3"
                        }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }
                            console.log("\n Artist(s)/Band: " + data.tracks.items[0].album.artists[0].name);
                            console.log("      Song Title: " + data.tracks.items[0].name);
                            console.log("         Album: " + data.tracks.items[0].album.name);
                            console.log(" Original Released: " + data.tracks.items[0].album.release_date + "\n\n");
                            console.log("\n \n      Hit the up arrow once (when you're done reading)\n\n");
                        });

                        //////////////--------------------------------------////////
                        reqInquirer
                            .prompt([{
                                type: "confrim",
                                message: "  \n\n        Would you like to make another Search? - y/n\n\n",
                                name: "research",
                            }]).then(function (inquirerResponse) {

                                if (inquirerResponse.research === "y") {
                                    splash();

                                } else {
                                    console.log("\n\n\n             Thanks for your time-\n\n\n");
                                };
                            });
                        //////////////----------------------------------------////////
                    }
                });

            }
            /////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////



            /////////////////////////////-----INQUIRER IN---------//////////////////////////////////////////
        });
}
//////////////////////////////-----INQUIRER OUT-------/////////////////////////////////////////




splash();