const fs = require('fs')
const path = require('path')
const normalizedPath = path.join(__dirname);
const Router = []

fs
	.readdirSync(normalizedPath)
	.filter((file) => file !== 'index.js' )
	.forEach((file) => {
		const key = file.split('.')[0]		
		Router[key] = require("./" + file)
	})
	
module.exports = Router


// exports.jumbotrons = require("./jumbotrons.js");
// exports.users = require("./users.js");




// var normalizedPath = require("path").join(__dirname, "routes");

// fs
// .readdirSync(normalizedPath)
// .forEach(function(file) {
//   require("./routes/" + file);
// });