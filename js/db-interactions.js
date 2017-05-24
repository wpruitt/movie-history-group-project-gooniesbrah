"use strict";

let $ = require('jquery'),
    firebase = require("./firebaseConfig");

function getMovie(movie) {
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://api.themoviedb.org/3/search/movie?api_key=7cf213fd59bc986d0eb48bf0aead461a&language=en-US&query=${movie}&page=1&include_adult=false`
		}).done(function(movieData){
			resolve(movieData);
		}).fail(function(error){
			reject(error);
		});
	});
}



module.exports = {
	getMovie
};