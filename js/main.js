"use strict";

console.log("MAIN.JS");

let $ = require('jquery'),
    db = require("./db-interactions"),
    // templates = require("./dom-builder"),
    user = require("./user");

$("#auth-btn").click(function(){
	console.log("clicked on auth btn");
  	user.logInGoogle()
  	.then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});

$("#find-new-movies").click(function(){
	console.log("find new movies clicked");
	var inputItem = $("#input").val();
	console.log("inputItem", inputItem);
	db.getMovie(inputItem)
	.then(function(movieData){
	console.log("movie data", movieData);
	});
});

$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});
