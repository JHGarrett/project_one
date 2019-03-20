$(document).ready(function() {



    function ebayAPICall (/* keywords and category */) {

        var APPID = "JohnGarr-LiveMerc-PRD-579702c8a-5db31c8d";
        var operationName = "findItemsAdvanced";
        var entriesPerPage = 10;
        var keywords = "Queen+Merchandise";

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
        });
    }

    ebayAPICall();

});