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
            var textBox = $("<div>").addClass("text").prepend($("<a href=\""+eventResults[x].uri+"\"><h2>"+eventTitle+"</h2></a>")).append(($("<p> Artists: "+artistPerforming+"</p>")))
            $(".artistAccordion").append(outerBox.append(imageBox.append(textBox)));
        }   
    }

    // Take note that this band is not the same as the global variable
    function ebayAPICall (band) {

        var APPID = "JohnGarr-LiveMerc-PRD-579702c8a-5db31c8d";
        var operationName = "findItemsAdvanced";
        var entriesPerPage = 5;
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
                    $(".ebayAccordion").append(makeEbayResultDiv(resultsArray[i], i+1));
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

    ebayAPICall(band);

});
