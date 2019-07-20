const {sequelize} = require('./models')
const http = require('http');
const app = require('./app');
const config = require('./configs/config') 

const port = config.port;
const server = http.createServer(app);

sequelize.sync()
// sequelize.sync({force:true})
.then(() => {
	server.listen(port);
	console.log(`Server listening on port: ${port}`);
})	
