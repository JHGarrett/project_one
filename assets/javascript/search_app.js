var locationName = ""
var bandName = "";
var apiKey = "fEMnsQXTSSaQ9FF0";
var globalEvent;
var prependEventURL = "https://api.songkick.com/api/3.0/events.json?apikey=";
var prependLocationURL = "https://api.songkick.com/api/3.0/search/locations.json?&apikey="+apiKey+"&query="

var searchParams = new URLSearchParams(window.location.search);

var band = searchParams.get("band"); // test
var city = searchParams.get("city");
var state = searchParams.get("state");

console.log(band);
console.log(city);
console.log(state);


function printResults(eventResults){

    //If old search results exist, then remove
    if($("#songKickResults").children().length >= 1){

        $("#songKickResults").children().remove();
    }

    // Adding new search results
    $("#results").prepend($("<h4> Search Results </h4>").css("color", "black"))
    
    for(var x = 0; x < eventResults.length; x++){
        console.log(x)
        // var row = $("<div class=\"row\">");
        var col = $("<div class=\"col-md-6\">")
        var card = $("<div class=\"card\">");
        var cardBody = $("<div class=\"card-body\">");
        var artistPerforming = ""
        for (var y = 0; y < eventResults[x].performance.length; y++){
            artistPerforming += (eventResults[x].performance[y].displayName + ", ")
        }
        artistPerforming.slice(0,-1);
        console.log(eventResults[0].start.date)
        cardBody.prepend($("<p class=\"card-text\"> Playing on " + eventResults[x].start.date +" at " + eventResults[x].venue.displayName + "</p>").css("color", "black"))
        cardBody.prepend($("<p class=\"card-text\">"+artistPerforming+"<p>").css("color", "black"))
        cardBody.prepend($("<a href=\""+eventResults[x].uri+"\"><h5 class=\"card-title\">"+eventResults[x].displayName+"</h5></a>").css("color", "black"))
        cardBody.prepend($("<img src=\"http://images.sk-static.com/images/media/profile_images/artists/"+eventResults[x].performance[0].artist.id+"/huge_avatar\" class=\"card-img-top\" alt=\"artist-picture\"> "))
        $("#songKickResults").append(col.append(card.append(cardBody)))

}
}

    $(document).ready(function(){

        //User hasn't input
        if((city === "") && (band === "")){     
            $(".container").children().remove();
            alert("Please type in an artist's name or location.")

            

        } else{

        //If user doesn't input artist, will search for all  for upcoming concerts at indicated locaiton. 
        //Searches the location query based on what city the user puts. Metro ID is retrieved with the city that matches the state the user specifies.
            if((city !== "") && (state !== "")){
                //Getting city and state values
                var stateName = state;
                var metroName = city;
                console.log("xxxx")
                //Searching in the location end point to obtain a metroID for the city in the specificed state
                var metroID;
                var queryLocationURL = prependLocationURL+metroName+"&apikey="+apiKey;
                console.log(queryLocationURL)

                $.ajax({
                    url: queryLocationURL,
                    method: "GET"

                }).then(function(data){
                    //Getting location object
                    console.log("ooo")
                    console.log(data)
                    var results = data.resultsPage.results.location;
                    console.log(results)

                    if(results !== undefined){
                        for (var i = 0; i < results.length; i++){
                            if(results[i].metroArea.country.displayName === "US"){
                                // console.log(results[i].metroArea.state.displayName);
                                //If the state in the location query matches the state that the user inputted, we have found a match of that city for the specifed state. MetroID is assigned.
                                if((results[i].metroArea.state.displayName === stateName)){
                                    metroID = results[i].metroArea.id;
                                    // console.log(metroID);
                                    // console.log(i);
                                    break;
                                }
                            }
                        }
    
                        //Query is able to find the city in the state. Add metroID to the event query URL string. If query cannot find a match, a metroID will not assigned and locationName will be an empty string
                        if(metroID !== undefined){
                            locationName = "&location=sk:"+metroID;
                        }
    
    
                        // console.log(locationName);
    
                        // console.log("Getting band name")
    
                        //If the band input field is not blank, band name value is stored in query. Else, the user is searching by location only.
                        if(band !== ""){
                            bandName = "&artist_name="+band;
                        }

                        console.log(bandName);
                
                        //If we are searching by location
                        if(locationName !== ""){
                            var queryEventURL = prependEventURL+apiKey+locationName+bandName+"&per_page=50";
                            bandName = "";
                            console.log(queryEventURL)
                        
                            //Getting JSON Object for band concerts
                            $.ajax({
                            url: queryEventURL,
                            method: "GET"
                    
                            }).then(function(data){
                            console.log(data)
                            globalEvent = data;
                            //Getting event object
                            var eventResults = data.resultsPage.results.event;
    
                            //City is in the state but there are no bands in that city performing.
                            if((data === undefined) || (eventResults === undefined)){
                                console.log("No events found");
                                alert("City is in the state but there are no bands in that city performing");
                            }

                            //Results have been found from city search
                            else{

                                printResults(eventResults);
                            }
                            
                    
                                })
                        }else{
                            //User types in city correctly but city is not in the state
                            alert("Sorry no results found with given city.")
                            console.log("Response - user types in city correctly but the city is not in the state.")
                        }

                        //When user has misspelled a city.
                    }else{
                        alert("No results found with given city found");
                        console.log("Error - mispelled city name")
                    }


                })
            
            //When user searches by band only
            }else if(band !== ""){

                var queryEventURL = prependEventURL+apiKey+"&artist_name="+band+"&per_page=50";
                $.ajax({
                    url: queryEventURL,
                    method: "GET"
                }).then(function(data){
                    globalEvent = data;
                    //Getting event object
                    var eventResults = data.resultsPage.results.event;
                    //When user has misspelled name of the artist or the spelling does not match standard format
                if((data === undefined) || (eventResults === undefined)){
                        alert("No events found for given band" );
                    console.log("no events found")
                }
                //Query has found band performances.
                else{
                    printResults(eventResults);
                }


                    })
                }
                //When the all input fields are blank 
                else{
                    alert("Please check all fields typed correctly.")
                }
            
        }
    })

