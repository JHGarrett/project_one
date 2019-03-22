$(document).ready(function() {


    var searchParams = new URLSearchParams(window.location.search);

    var band = searchParams.get("band"); // empty if no user input
    var city = searchParams.get("city");
    var state = searchParams.get("state");

    console.log(band);
    console.log(city);
    console.log(state);

    // Take note that this band is not the same as the global variable
    function ebayAPICall (band) {

        var APPID = "JohnGarr-LiveMerc-PRD-579702c8a-5db31c8d";
        var operationName = "findItemsAdvanced";
        var entriesPerPage = 5;
        var heroku = "https://cors-ut-bootcamp.herokuapp.com/";

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

            // console.log(response);

            responseJSON = JSON.parse(response);
            
            var resultsArray = responseJSON.findItemsAdvancedResponse[0].searchResult[0].item;

            console.log(resultsArray);

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
