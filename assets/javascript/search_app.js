    var locationName = ""
    var bandName = "";
    var apiKey = "fEMnsQXTSSaQ9FF0";
    var doneGettingLocation = false;
    var e

    
    $("#submitButton").on("click", function(event){
        event.preventDefault();

        //If user doesn't input city, will search for all locations for upcoming concerts. 
        //Searches the location query based on what city the user puts. Location ID is retrieved with the city that matches the state the user specifies.
        if($("#city-input").val() !== ""){
            var stateName = $("#stateInput").val();
            var metroID;
            var queryLocationURL = "https://api.songkick.com/api/3.0/search/locations.json?query="+$("#cityInput").val()+"&apikey="+apiKey;
            console.log(queryLocationURL)
            $.ajax({
                url: queryLocationURL,
                method: "GET"

            }).then(function(data){
                var results = data.resultsPage.results.location;
                console.log(results)
                for (var i = 0; i < results.length; i++){
                    if(results[i].metroArea.country.displayName === "US"){
                        console.log(results[i].metroArea.state.displayName);
                        if((results[i].metroArea.state.displayName === stateName)){
                            metroID = results[i].metroArea.id;
                            console.log(metroID)
                            console.log(i)
                            break;
                        }
                    }
                }
                if(metroID !== undefined){
                    locationName = "&location=sk:"+metroID;
                }


                console.log(locationName);

                console.log("Getting band name")
                //Getting Band name
                if($("#bandInput").val() !== ""){
                     bandName = "&artist_name="+$("#bandInput").val();
                }
                console.log(bandName);
        
                
                if(bandName !== "" || locationName !== ""){
                    var queryEventURL = "https://api.songkick.com/api/3.0/events.json?apikey="+apiKey+locationName+bandName+"&per_page=5";
                    bandName = "";
                    console.log(queryEventURL)
                
                    //Getting JSON Object for band concerts
                    $.ajax({
                    url: queryEventURL,
                    method: "GET"
            
                     }).then(function(data){
                    console.log(data)
                     e = data;
                     var eventResults = data.resultsPage.results.event;
                    if((data === undefined) || (eventResults === undefined)){
                        console.log("no events found")
                    }
                    else{

                        console.log(eventResults);
                        for(var x = 0; x < eventResults.length; x++){
                            console.log(x)
                            var row = $("<div class=\"row\">");
                            var col = $("<div class=\"col-md-6\">")
                            var card = $("<div class=\"card\">");
                            var cardBody = $("<div class=\"card-body\">");
                            var artistPerforming = ""
                            for (var y = 0; y < eventResults[x].performance.length; y++){
                                artistPerforming += (eventResults[x].performance[y].displayName + " ")

                            }
                            console.log(eventResults[0].start.date)
                            cardBody.prepend($("<p class=\"card-text\"> Playing on " + eventResults[x].start.date +" at " + eventResults[x].venue.displayName + "</p>").css("color", "black"))
                            cardBody.prepend($("<p class=\"card-text\">"+artistPerforming+"<p>").css("color", "black"))
                            cardBody.prepend($("<h5 class=\"card-title\">"+eventResults[x].displayName+"</h5>").css("color", "black"))
                            $("#results").append(row.append(col.append(card.append(cardBody))))
                        }
                    }
                    
            
                        })
                }else{

                    console.log("no results found")
                }

            })
            
        }


     

    })