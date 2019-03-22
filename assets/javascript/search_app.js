var locationName = ""
var bandName = "";
var apiKey = "fEMnsQXTSSaQ9FF0";
var searchError= false;
var prependEventURL = "https://api.songkick.com/api/3.0/events.json?apikey=";
var prependLocationURL = "https://api.songkick.com/api/3.0/search/locations.json?&apikey="+apiKey+"&query="

var searchParams = new URLSearchParams(window.location.search);

var band = searchParams.get("band"); // test
var city = searchParams.get("city");
var state = searchParams.get("state");

console.log(band);
console.log(city);
console.log(state);

var bandArray = [];
function runError(searchError){
    if(searchError){

        alert("Sorry, there are no bands playing in your city.");
        setTimeout(function(){
            window.location.href="index.html"
        }, 1000)
    }
}

function printResults(eventResults){

    // Adding new search results
    console.log("printing results")
    for(var x = 0; x < eventResults.length; x++){
        var startDate = eventResults[x].start.date;
        var eventTitle = eventResults[x].displayName;
        var artistID = eventResults[x].performance[0].artist.id;
        var backgroundImageLink = "url(\"http://images.sk-static.com/images/media/profile_images/artists/"+artistID+"/huge_avatar\")";
        console.log(backgroundImageLink)
        var artistPerforming = eventResults[x].performance[0].displayName;
        if (eventResults[x].performance.length > 0){
            artistPerforming += " & more";

        }
        console.log(artistPerforming);
        var outerBox = $("<div>").addClass("box a"+(x+1)).css("background-image", backgroundImageLink);
        var imageBox = $("<div>").addClass("image_a"+(x+1));
        var textBox = $("<div>").addClass("text").prepend($("<a target=\"_blank\" href=\""+eventResults[x].uri+"\"><h2>"+eventTitle+"</h2></a>")).append(($("<p> Artists: "+artistPerforming+"</p>")))
        $(".artistAccordion").append(outerBox.append(imageBox.append(textBox)));
    }   
}

    $(document).ready(function(){

        //User hasn't input
        if((city === "") && (band === "")){     
            $(".container").children().remove();
            // alert("Please type in an artist's name or location.")
            searchError = true;

            

        } else{

        //If user doesn't input artist, will search for all  for upcoming concerts at indicated locaiton. 
        //Searches the location query based on what city the user puts. Metro ID is retrieved with the city that matches the state the user specifies.
            if((city !== "") && (state !== "")){
                //Getting city and state values
                var stateName = state;
                var metroName = city;
                //Searching in the location end point to obtain a metroID for the city in the specificed state
                var metroID;
                var queryLocationURL = prependLocationURL+metroName+"&apikey="+apiKey;
                console.log(queryLocationURL)

                $.ajax({
                    url: queryLocationURL,
                    method: "GET"

                }).then(function(data){
                    //Getting location object
                    console.log(data)
                    var results = data.resultsPage.results.location;
                    console.log(results)

                    if(results !== undefined){
                        for (var i = 0; i < results.length; i++){
                            if(results[i].metroArea.country.displayName === "US"){
                                //If the state in the location query matches the state that the user inputted, we have found a match of that city for the specifed state. MetroID is assigned.
                                if((results[i].metroArea.state.displayName === stateName)){
                                    metroID = results[i].metroArea.id;
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
                            var queryEventURL = prependEventURL+apiKey+locationName+bandName+"&per_page=5";
                            bandName = "";
                            console.log(queryEventURL)
                        
                            //Getting JSON Object for band concerts
                            $.ajax({
                            url: queryEventURL,
                            method: "GET"
                    
                            }).then(function(data){
                            //Getting event object
                            var eventResults = data.resultsPage.results.event;
                            console.log(eventResults)
                            //City is in the state but there are no bands in that city performing.
                            if((data === undefined) || (eventResults === undefined)){
                                searchError = true
                                runError(searchError)
                            }

                            //Results have been found from city search
                            else{

                                if (band === ""){
                                    console.log("adding to bandArray")
                                    for (var i = 0; i < eventResults.length; i++){
                                        bandArray.push(eventResults[i].performance[0].displayName)
                                    }
                                }


                                printResults(eventResults);
                            }
                            
                    
                                })
                        }else{
                            //User types in city correctly but city is not in the state
                            searchError = true
                            runError(searchError)
                            console.log("Response - user types in city correctly but the city is not in the state.")
                        }

                        //When user has misspelled a city.
                    }else{
                        searchError = true
                        runError(searchError)
                        console.log("Error - mispelled city name")
                    }


                })
            
            //When user searches by band only
            }else if(band !== ""){

                var queryEventURL = prependEventURL+apiKey+"&artist_name="+band+"&per_page=5";
                $.ajax({
                    url: queryEventURL,
                    method: "GET"
                }).then(function(data){
                    //Getting event object
                    var eventResults = data.resultsPage.results.event;
                    console.log(eventResults)
                    //When user has misspelled name of the artist or the spelling does not match standard format
                //Query has found band performances.
                    printResults(eventResults);
                


                    })
                }
            
        }
    


    })