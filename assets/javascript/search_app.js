    var locationName = ""
    var bandName = "";
    var apiKey = "fEMnsQXTSSaQ9FF0";
    var doneGettingLocation = false;
    var globalEvent;

    
    $(".submitButton").on("click", function(event){


        event.preventDefault();

        if($("#cityInput").val() === "" && $("#bandInput").val() === ""){
            
            alert("please search by a city or band")

        } else{
        //If user doesn't input artist, will search for all  for upcoming concerts at indicated locaiton. 
        //Searches the location query based on what city the user puts. Metro ID is retrieved with the city that matches the state the user specifies.
            if(($("#cityInput").val() !== "") && ($("#stateInput").val() !== "")){
                //Getting city and state values
                var stateName = $("#stateInput").val();
                var metroName = $("#cityInput").val().trim();
                //clearing city input
                $("#cityInput").val("")
                //Searching in the location end point to obtain a metroID for the city in the specificed state
                var metroID;
                var queryLocationURL = "https://api.songkick.com/api/3.0/search/locations.json?query="+metroName+"&apikey="+apiKey;
                // console.log(queryLocationURL)

                $.ajax({
                    url: queryLocationURL,
                    method: "GET"

                }).then(function(data){
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
    
                        //Query is able to find the city and state. Add metroID to the event query URL string. If query cannot find a match, a metroID will not assigned and locationName will be an empty string
                        if(metroID !== undefined){
                            locationName = "&location=sk:"+metroID;
                        }
    
    
                        // console.log(locationName);
    
                        // console.log("Getting band name")
    
                        //Getting band name from the input field if it's not blank
                        if($("#bandInput").val() !== ""){
                            bandName = "&artist_name="+$("#bandInput").val();
                            $("#bandInput").val("")
                        }
                        // console.log(bandName);
                
                        //If we are searching by location
                        if(locationName !== ""){
                            var queryEventURL = "https://api.songkick.com/api/3.0/events.json?apikey="+apiKey+locationName+bandName+"&per_page=5";
                            bandName = "";
                            console.log(queryEventURL)
                        
                            //Getting JSON Object for band concerts
                            $.ajax({
                            url: queryEventURL,
                            method: "GET"
                    
                            }).then(function(data){
                            console.log(data)
                            globalEvent = data;
                            var eventResults = data.resultsPage.results.event;
    
                            //If no query has been found after searching by city
                            if((data === undefined) || (eventResults === undefined)){
                                console.log("No events found");
                                alert("No events found");
                            }

                            //Results have been found from city search
                            else{

                                localStorage.setItem("result", JSON.stringify(eventResults));

                                

                                //If old search results exist, then remove them
                                // if($("#results").children().length >= 1){
                            
                                //     $("#results").children().remove();
                                // }

                                //Adding new search results in the results div
                                // $("#results").prepend($("<h4> Search Results </h4>").css("color", "black"))
                                // console.log(eventResults);
                                // for(var x = 0; x < eventResults.length; x++){
                                //     console.log(x)
                                //     var row = $("<div class=\"row\">");
                                //     var col = $("<div class=\"col-md-6\">")
                                //     var card = $("<div class=\"card\">");
                                //     var cardBody = $("<div class=\"card-body\">");
                                //     var artistPerforming = ""
                                //     for (var y = 0; y < eventResults[x].performance.length; y++){
                                //         artistPerforming += (eventResults[x].performance[y].displayName + " ")
    
                                //     }
                                //     console.log(eventResults[0].start.date)
                                //     cardBody.prepend($("<p class=\"card-text\"> Playing on " + eventResults[x].start.date +" at " + eventResults[x].venue.displayName + "</p>").css("color", "black"))
                                //     cardBody.prepend($("<p class=\"card-text\">"+artistPerforming+"<p>").css("color", "black"))
                                //     cardBody.prepend($("<h5 class=\"card-title\">"+eventResults[x].displayName+"</h5>").css("color", "black"))
                                //     $("#results").append(row.append(col.append(card.append(cardBody))))    
                                // }
                            }
                            
                    
                                })
                        }else{
                            //When there are no bands in that city performing
                            alert("Sorry no results found with given city.")
                            console.log("Response - no bands are playing in that current city.")
                        }

                        //When user has misspelled a city for a state
                    }else{
                        alert("No results found with given city found");
                        console.log("Error - misspelled city name")
                    }


                })
            
            //When user searches by band only
            }else if($("#bandInput").val() !== ""){

                var queryEventURL = "https://api.songkick.com/api/3.0/events.json?apikey="+apiKey+"&artist_name="+$("#bandInput").val()+"&per_page=5";
                $("#bandInput").val("")
                $.ajax({
                    url: queryEventURL,
                    method: "GET"
                }).then(function(data){
                    globalEvent = data;
                    var eventResults = data.resultsPage.results.event;
                    //If no query is found. Reasons - user has misspelled name of artist
                if((data === undefined) || (eventResults === undefined)){
                        alert("No events found");
                    console.log("no events found")
                }
                //Else, storing results and printing results
                else{

                    //Storing result
                    localStorage.setItem("result", JSON.stringify(eventResults));

                    //If old search results exist, then remove
                    // if($("#results").children().length >= 1){

                    //     $("#results").children().remove();
                    // }
                    //Adding new search results
                    // $("#results").prepend($("<h4> Search Results </h4>").css("color", "black"))
                    // console.log(eventResults);
                    // for(var x = 0; x < eventResults.length; x++){
                    //     console.log(x)
                    //     var row = $("<div class=\"row\">");
                    //     var col = $("<div class=\"col-md-6\">")
                    //     var card = $("<div class=\"card\">");
                    //     var cardBody = $("<div class=\"card-body\">");
                    //     var artistPerforming = ""
                    //     for (var y = 0; y < eventResults[x].performance.length; y++){
                    //         artistPerforming += (eventResults[x].performance[y].displayName + " ")
                    //     }
                    //     console.log(eventResults[0].start.date)
                    //     cardBody.prepend($("<p class=\"card-text\"> Playing on " + eventResults[x].start.date +" at " + eventResults[x].venue.displayName + "</p>").css("color", "black"))
                    //     cardBody.prepend($("<p class=\"card-text\">"+artistPerforming+"<p>").css("color", "black"))
                    //     cardBody.prepend($("<h5 class=\"card-title\">"+eventResults[x].displayName+"</h5>").css("color", "black"))
                    //     $("#results").append(row.append(col.append(card.append(cardBody))))
                        
                    // }
                }


                    })
                }       
            
        }
    })



