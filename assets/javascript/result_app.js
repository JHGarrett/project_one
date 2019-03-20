function printResults(){

    //If old search results exist, then remove
    if($("#results").children().length >= 1){

        $("#results").children().remove();
    }

    // Adding new search results
    $("#results").prepend($("<h4> Search Results </h4>").css("color", "black"))

    var storedResults = JSON.parse(localStorage.getItem("result"));

    console.log(storedResults);
    
    for(var x = 0; x < storedResults.length; x++){
        console.log(x)
        var row = $("<div class=\"row\">");
        var col = $("<div class=\"col-md-6\">")
        var card = $("<div class=\"card\">");
        var cardBody = $("<div class=\"card-body\">");
        var artistPerforming = ""
        for (var y = 0; y < storedResults[x].performance.length; y++){
            artistPerforming += (storedResults[x].performance[y].displayName + ", ")
        }
        console.log(storedResults[0].start.date)
        cardBody.prepend($("<p class=\"card-text\"> Playing on " + storedResults[x].start.date +" at " + storedResults[x].venue.displayName + "</p>").css("color", "black"))
        cardBody.prepend($("<p class=\"card-text\">"+artistPerforming+"<p>").css("color", "black"))
        cardBody.prepend($("<a href=\""+storedResults[x].uri+"\"><h5 class=\"card-title\">"+storedResults[x].displayName+"</h5></a>").css("color", "black"))
        cardBody.prepend($("<img src=\"http://images.sk-static.com/images/media/profile_images/artists/"+storedResults[x].performance[0].artist.id+"/huge_avatar\" class=\"card-img-top\" alt=\"artist-picture\"> "))
        $("#results").append(row.append(col.append(card.append(cardBody))))

}
}

function main(){
    if(localStorage.length > 0){
        printResults();
    }
    
}

//Running main program
main();