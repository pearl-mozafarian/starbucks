var OUR_KEY = 'AIzaSyAjB0z2sG-kIlF4cnQiLwF2q78SE1QjVKQ';
var map;
var service;
var infowindow;
var gameObject = {
    searchParam: "starbucks",
    currentLocation: {lat: null, long: null},
    resultArray: [],
    type: "cafe",
    radius: "2500",
    maxNumber: null,
    score: 0
};

$(document).ready(function () {
    getLocation();
    $("#bt_submit").click(start_the_game);

});/////ready
$(document).keypress(function(e) {
    if(e.which == 13) {
        start_the_game();
    }
});
function start_the_game() {
    // console.log("loc: ",gameObject.currentLocation);
    gameObject.maxNumber = gameObject.resultArray.length;
    // console.log("the number: "+ gameObject.maxNumber);
    check_win(gameObject.maxNumber);
}////start_the_game

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function initMap(user_location) {
    var my_location = new google.maps.LatLng(user_location.coords.latitude, user_location.coords.longitude);
    gameObject.currentLocation.lat = user_location.coords.latitude;
    gameObject.currentLocation.long = user_location.coords.longitude;
    map = new google.maps.Map(document.getElementById('map'), {
        center: my_location,
        zoom: 14
        // mapTypeId: google.maps.MapTypeId.HYBRID
    });


    //infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: my_location,
        radius: gameObject.radius,
        type: gameObject.type,
        name: gameObject.searchParam
    }, callback);

    var marker_here = new google.maps.Marker({
        map: map,
        position: my_location,
        animation:google.maps.Animation.BOUNCE
    });
//        service.nearbySearch(request, callback);
}

function callback(results, status) {
    // console.log('callback ',results,status);
    gameObject.resultArray= results;
    // console.log("reult array: ",gameObject.resultArray);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function check_win(the_number) {
    $("#response_div").show();
    // console.log("check win");
    var user_guess = $("#guess_input").val();
    // console.log(user_guess);
    $("#response_div").show();
    user_guess = parseInt(user_guess);
    if(isNaN(user_guess) ) {
        $("#response_div").html("Please Enter a number.");
    }else if (user_guess>gameObject.resultArray.length+5) {
        gameObject.score+=1;
        $("#response_div").css("color","red").html("Too High!");
        shake();
    }
    else if ( user_guess <0) {
        $("#response_div").html("This is not a valid number.");
    }else if (user_guess == the_number) {
        gameObject.score+=1;
        $("#response_div").css("color","green").animate({fontSize: '1.5em'}, "slow");
        $("#response_div").html("You guessed it! attempts: "+gameObject.score);
        $("#bt_submit").hide();
        $("#overlay").hide();
    }else if (user_guess > the_number && user_guess<=gameObject.resultArray.length+5 ) {
        gameObject.score+=1;
        $("#response_div").css("color","#FA8072").html("High!");
        shake();
    }else if (user_guess < the_number-5) {
        gameObject.score+=1;
        $("#response_div").css("color","white").html("Too Low! ");
        shake();
    }else if (user_guess < the_number && user_guess>= the_number-5) {
        gameObject.score+=1;
        $("#response_div").css("color","#87CEFA").html("Low! ");
        shake();
    }
    $("#guess_input").val("");
}

function shake(){
    $( "#content" ).effect( "shake" );
}
