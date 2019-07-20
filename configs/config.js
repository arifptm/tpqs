require('dotenv').config()
var database = '';
var password = '';
var user = '';
var dialect = '';
var strg = '';

if(process.env.DBS == 'mysql'){
	user = 'xxx';	
	database = 'yyy';
	password = 'zzz';
	dialect = 'mysql';
} else if(process.env.DBS == 'sqlite'){		
	dialect = 'sqlite'
	strg = './db.sqlite'
}

module.exports = {
	port: 3000,
	jwtSecret: process.env.JWT_SECRET,

	db: {
		database: database,
		user: user,
		password: password,
		options: {
			dialect: 'sqlite',
			host: 'localhost',
			storage: strg
			// operatorsAliases: false
		}
	},

	storage:{
		users: 'static/users',
		members: 'static/members',
		backgrounds: 'static/backgrounds',
		jumbotrons: 'static/jumbotrons',
		murottals: 'static/murottals',
		videos: 'static/videos',
		settings: 'static/settings',
		tmp: 'static/tmp'
	},

	payTimes: 10

}
