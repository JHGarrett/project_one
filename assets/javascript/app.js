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



$(document).ready(function() {

    function printResults(eventResults){

        // Adding new search results
        console.log("printing results")
        for(var x = 0; x < eventResults.length; x++){
            console.log(eventResults.length)
            var startDate = eventResults[x].start.date;
            var eventTitle = eventResults[x].displayName;
            console.log(eventTitle)
            var backgroundImageLink = "url(\"http://images.sk-static.com/images/media/profile_images/artists/"+eventResults[x].performance[0].artist.id+"/huge_avatar\")";
            console.log(backgroundImageLink)
            var artistPerforming = eventResults[x].performance[0].displayName;
            if (eventResults[x].performance.length > 0){
                artistPerforming += " & more";
    
            }
            console.log(artistPerforming);
            var outerBox = $("<div>").addClass("box a"+(x+1)).css("background-image", backgroundImageLink);
            var imageBox = $("<div>").addClass("image_a"+(x+1));
            var textBox = $("<div>").addClass("text").prepend($("<a href=\""+eventResults[x].uri+"\" target='_blank'><h2>"+eventTitle+"</h2></a>")).append(($("<p> Artists: "+artistPerforming+"</p>")))
            $(".artistAccordion").append(outerBox.append(imageBox.append(textBox)));
        }   
    }

    function songKick () {

        //Getting city and state values
        var stateName = state;
        var metroName = city;
        //Searching in the location end point to obtain a metroID for the city in the specificed state
        var metroID;
        var queryLocationURL = prependLocationURL+city+"&apikey="+apiKey;
        
        console.log(queryLocationURL)

        if ((city === "" || state === "") && band === ""){
            // Default search by client ID
            $("#events-message").text("If looking for a specific location, both city and state must be filled on the previous form." +
            "  We went ahead and searched by your current location!");
            var queryEventURL = prependEventURL+apiKey+"&per_page=5&location=clientip";
            eventsCall(queryEventURL);            

        } else if ((city === "" || state === "") && band !== "") {
            // Searching for band only, can be in any location in the US
            var queryEventURL = prependEventURL+apiKey+"&per_page=5&artist_name=" + band;
            eventsCall(queryEventURL);

        } else if (band === "" && city !== "" && state !== "") {
            // searching only by location (city, state)

            // All further AJAX and event API queries and displaying results will be done in location check and 
            // further nested fucntions
            var locationResults = locationCall(queryLocationURL);
            

        } else if (band !== "" && city !== "" && state !== "") {
            // Searching by all parameters

            // All further AJAX and event API queries and displaying results will be done in location check and 
            // further nested fucntions
            var locationResults = locationCall(queryLocationURL, band);
        }

        
    }

    function findMetroID(results) {
        for (var i = 0; i < results.length; i++){
            if(results[i].metroArea.country.displayName === "US"){
                //If the state in the location query matches the state that the user inputted, we have found a match of that city for the specifed state. MetroID is assigned.
                if((results[i].metroArea.state.displayName === state)){
                    return results[i].metroArea.id;
                }
            }
        }
        return false;
    }

    // Look to see if location is valid for songkick API
    function locationCall(queryLocationURL, band = "") {

        $.ajax({
            url: queryLocationURL,
            method: "GET"

        }).then(function(data){
            //Getting location object
            console.log(data);
            var locationResults = data.resultsPage.results.location;
            console.log(locationResults);

            if (locationResults !== undefined) {
                // Do search, first grab metroID
                var metroID = findMetroID(locationResults);

                //Query is able to find the city in the state. Add metroID to the event query URL string. 
                //If query cannot find a match, a metroID will not assigned and locationName will be an empty string
                if(metroID !== undefined){
                    locationName = "&location=sk:"+metroID;
                }

                //If the band input field is not blank, band name value is stored in query. 
                //Else, the user is searching by location only.
                if(band !== ""){
                    bandName = "&artist_name="+band;
                } 
                // bandName is "" if band === "" (defined in globals)
                var queryEventURL = prependEventURL+apiKey+locationName+bandName+"&per_page=5";
                eventsCall(queryEventURL);

            } else {

                if (band === "") {
                    // Invalid location, searching by client IP
                    $("#events-message").text("We couldn't find your entered location so we're searching by your current location!")
                    
                    var queryEventURL = prependEventURL+apiKey+"&per_page=5&location=clientip";
                    eventsCall(queryEventURL);

                } else {
                    // Search by band
                    $("#events-message").text("We couldn't find your entered location so we're searching for your band country-wide!")
                
                    var queryEventURL = prependEventURL+apiKey+"&per_page=5&artist_name=" + band;
                    eventsCall(queryEventURL);
                }
            }

        });
    }

    function eventsCall(eventsURL) {

        console.log("Events URL: " + eventsURL);

        $.ajax({
            url: eventsURL,
            method: "GET"
        }).then(function(response) {
            
            var eventResults = response.resultsPage.results.event;

            console.log(eventResults)

            //City is in the state but there are no bands in that city performing.
            if((response === undefined) || (eventResults === undefined)){

                var itemDiv = $("<div>");

                itemDiv.addClass(
                    "event-item box a" + 0
                ).append(
                    $("<div class='text'>").append(
                        $("<h2>").text(
                            "Sorry no events were found."
                        )
                    )
                );
                $(".b0").css("background-image", "url(assets/images/compressedLoading.gif)")

                $(".artistAccordion").append(itemDiv);

            } else {

                if (band === ""){
                    // add bands to band Array and send them to ebayAPICall
                    console.log("adding to bandArray")
                    for (var i = 0; i < eventResults.length; i++){
                        ebayAPICall(eventResults[i].performance[0].displayName, 1, i+1);
                        // console.log(eventResults[i].performance[0].displayName);
                    }
                } else {
                    // call ebayAPICall with just one band
                    ebayAPICall(band, 5);
                }

                //print results if there results
                printResults(eventResults);
            }
        });
    }

    // Take note that this band is not the same as the global variable
    function ebayAPICall (band, entries, index = undefined) {

        var APPID = "JohnGarr-LiveMerc-PRD-579702c8a-5db31c8d";
        var operationName = "findItemsAdvanced";
        var entriesPerPage = entries;
        var heroku = "https://cors-ut-bootcamp.herokuapp.com/";

        //Replace spaces in with +s in band search
        var reg = new RegExp(" ", "g");
        var keywords = band.replace(reg, "+");
        console.log(keywords);

        keywords = keywords;

        console.log(keywords)

        var queryURL = heroku + "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=" + operationName + 
        "&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=" + APPID + "&RESPONSE-DATA-FORMAT=JSON&" + 
        "REST-PAYLOAD=true&paginationInput.entriesPerPage=" + entriesPerPage + "&categoryId=11450" +
        "&keywords=" + keywords;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            responseJSON = JSON.parse(response);
            
            var resultsArray = responseJSON.findItemsAdvancedResponse[0].searchResult[0].item;

            console.log(resultsArray);

            // If no results are returned then display stand alone telling the user that
            if (resultsArray.length === 0) {

                var itemDiv = $("<div>");

                itemDiv.addClass(
                    "ebay-item box b" + 0
                ).append(
                    $("<div class='text'>").append(
                        $("<h2>").text(
                            "Sorry no results were found."
                        )
                    )
                );
                $(".b0").css("background-image", "url(assets/images/compressedLoading.gif)")

                $(".ebayAccordion").append(itemDiv);

            } else {
                for (var i = 0; i < resultsArray.length; i++) {
                    if (index == undefined) {
                        $(".ebayAccordion").append(makeEbayResultDiv(resultsArray[i], i+1));
                    } else {
                        $(".ebayAccordion").append(makeEbayResultDiv(resultsArray[i], index));
                    }
                }
            }

            
        });
    }

    function makeEbayResultDiv(item, i) {
        var itemDiv = $("<div>");

        itemDiv.addClass(
            "ebay-item box b" + i
        ).append(
            $("<div class='text'>").append(
                $("<h2>").append(
                    $("<a>").attr({
                        target: "_blank",
                        href: item.viewItemURL[0]
                    }).text(
                        item.title[0]
                    )
                )
            ).append(
                $("<p>").text(
                    "Current Price: " + item.sellingStatus[0].convertedCurrentPrice[0].__value__ + " " + 
                        item.sellingStatus[0].convertedCurrentPrice[0]["@currencyId"]
                )
            )
        );
        findImage(item.viewItemURL[0], i);
        return itemDiv;
    }

    function findImage(url, i) {

        var prependURL = "https://cors-ut-bootcamp.herokuapp.com/";
        $.get(prependURL + url, function(data) {
            var image = $(data).find("#icImg");
            console.log($(image).attr("src"));
            $(".b"+i).css("background-image", "url(" + $(image).attr("src") + ")");
        });
    }

    songKick();

});
