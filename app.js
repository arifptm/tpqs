const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// const mongoose = require('mongoose')
const moment = require('moment')

const Router = require('./routes/index.js');

// mongoose.connect('mongodb://localhost:27017/papindi', {useNewUrlParser: true});

app.use(morgan('combined'));
// app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use('/static', express.static('static', { maxAge: 864000 }))

Object.keys(Router).forEach(function(file){
	app.use('/' + file, Router[file])
});

app.use((req,res,next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error,req,res,next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;


// const {sequelize} = require('./models')
// const config = require('./config/config')


// // const adhan = require('adhan') 
// // const Moment = require('moment');
// // const MomentRange = require('moment-range');
// // const moment = MomentRange.extendMoment(Moment); 

// 


// const io = require('socket.io')(server);


// require('./routes')(app)
// require('./events')(io)


// sequelize.sync()
// // sequelize.sync({force:true})
// 	.then(() => {
// 		server.listen(config.port)
// 		console.log('Server connected')
// 	})	
