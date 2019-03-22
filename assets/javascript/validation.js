var apiKey = "fEMnsQXTSSaQ9FF0";
var prependEventURL = "https://api.songkick.com/api/3.0/events.json?apikey=";
var prependLocationURL = "https://api.songkick.com/api/3.0/search/locations.json?&apikey="+apiKey+"&query="

$(document).ready(function() {

    $(".submitButton").on("click", function(event){
        event.preventDefault();

        var band = $("#bandInput").val().trim();
        $.ajax({
            url: prependEventURL + apiKey + "&artist_name=" + band,
            method: "GET"
        }).then(function(response){ 
            if (response.resultsPage.results.event == undefined){
                console.log("invalid");
                //User types invalid band name
                if(band !== ""){
                    $(".modal-body p").text("Band is invalid");
                    $("#errorModal").modal("show");

                //Only searching by location
                } else if(band === ""){

                    $("#search-form").submit();
                }
                  
                //User searching by band only or by band AND location
            } else{
                $("#search-form").submit();
            }
           
        });
    });

})



   /*
     * User error
     *  user misspells city
     *  user misspells bands
     *  user types in a city that is not in the state
     * 
     *  Search errors
     *  
     * Check to use venue picture.
     */