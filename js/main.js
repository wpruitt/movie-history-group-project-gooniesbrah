"use strict";

console.log("MAIN.JS");

let $ = require('jquery'),
    db = require("./db-interactions"),
		Handlebars=require("hbsfy/runtime"),
		unwatchedcardsTemplate = require("../templates/unwatched-cards.hbs"),
		watchedcardsTemplate = require("../templates/watched-cards.hbs"),
    // templates = require("./dom-builder"),
    user = require("./user");


	var newMovieObj = {};






$("#auth-btn").click(function(){
	console.log("clicked on auth btn");
  	user.logInGoogle()
  	.then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});


//When find new movies is clicked - get matching title from movie database and display on page
$("#find-new-movies").click(function(){
    $("#input").focus();
    $(".movies").empty();
    let breadcrumbs = "< Search Results";
    $("#bread-crumbs").text(breadcrumbs);
	var inputItem = $("#input").val();
	db.getMovie(inputItem)
	.then(function(movieData){

		newMovieObj = movieData.results[0];
		db.getActors(newMovieObj.id)
		.then(function(actors){
			newMovieObj.cast = [];
			for (var i=0; i<5;i++){
				newMovieObj.cast.push(actors.cast[i]);
			}
			newMovieObj.starValue = 0;

			$(".movies").html(unwatchedcardsTemplate(newMovieObj));
		});
	});
});


$(document).on("click", '.add-to-watchlist', function(event){

    var userID = user.getUser();
	db.pushToFirebaseArray(newMovieObj.id, userID);
	db.pushToFirebase(newMovieObj, userID)
	.then(function(response){
		console.log(response);
		});
});


$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});


$("#show-unwatched-movies").click((event) =>{
    let breadcrumbs = "< Search Results/Unwatched";
    $("#bread-crumbs").text(breadcrumbs);
    $("#input").val("");
    let userID = user.getUser();
    console.log("Checking user ID", userID);
    db.pullWatchFromFirebase(userID)
    .then((data) =>{
        displayWatchList(data);

    });
//    .prop('disabled', true)......don't think we need to disable

});


function displayWatchList (watchObj) {
    $("#input").val("");
    $(".movies").empty();
     for (let key in watchObj) {
//            console.log("is this a key?" + data[key].title);
            let newMovieObj = watchObj[key];
            newMovieObj.key = key;
            $(".movies").append(watchedcardsTemplate(newMovieObj));
        }
}




$(document).on("click", '.watch-list-delete', function(event){
    let firebaseKey = event.currentTarget.parentElement.id;
    console.log("which key is being deleted" + firebaseKey);
    let deleteButton = event.currentTarget.parentElement;
    db.deleteWatchedMovie(firebaseKey);
    deleteButton.remove();
});









