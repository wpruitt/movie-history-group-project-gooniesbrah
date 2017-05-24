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
