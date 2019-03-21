$(document).ready(function() {



    function ebayAPICall (/* keywords and category */) {

        var APPID = "JohnGarr-LiveMerc-PRD-579702c8a-5db31c8d";
        var operationName = "findItemsAdvanced";
        var entriesPerPage = 10;
        var keywords = "Taylor+Swift+Merchandise";

        var queryURL = "https://cors-ut-bootcamp.herokuapp.com/http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=" + operationName + 
        "&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=" + APPID + "&RESPONSE-DATA-FORMAT=JSON&" + 
        "REST-PAYLOAD=true&paginationInput.entriesPerPage=" + entriesPerPage +
        "&keywords=" + keywords;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            responseJSON = JSON.parse(response);
            
            var resultsArray = responseJSON.findItemsAdvancedResponse[0].searchResult[0].item;

            console.log(resultsArray);

            for (var i = 0; i < resultsArray.length; i++) {
                $("#ebayResults").append(makeEbayResultDiv(resultsArray[i], i));
            }
        });
    }

    function makeEbayResultDiv(item, i) {
        var itemDiv = $("<div>");

        itemDiv.addClass(
            "ebay-item col-6 card"
        ).attr({
            
        }).append(
            $("<img class='card-img-top'>").attr({
                id: "image-" + i
            })
        ).append(
            $("<div class='card-body'>").append(
                $("<h3 class='card-title'>").append(
                    $("<a>").attr({
                        target: "_blank",
                        href: item.viewItemURL[0]
                    }).text(
                        item.title[0]
                    )
                )
            ).append(
                $("<h5 class='card-text'>").text(
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
            $("#image-" + i).attr({
                src: $(image).attr("src")
            });
        });
    }

    ebayAPICall();

});


// can you make it like this
/* <h1>Merchandise Results</h1>

<div class="ebayAccordion">

<div class="box b1">
            <div class="image_b1">
                <div class="text">
                    <h2>Lorem Ipsum</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum iaculis nisl sed dictum aliquam.
                    </p>
                </div>
            </div>
</div>
</div> */
