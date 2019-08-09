const {Event} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports = {	

	async getBalance (req,res,next) {
		try {
			const event = await Event.findAll({
				attributes: [[ Sequelize.fn("sum", Sequelize.col("cash")), "balance" ]]
			})

			res.send(event[0])

		} catch(err){
			res.status(500).send({ error: err})
		}
	}
}
	