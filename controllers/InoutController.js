const {Inout, Event, Member, Debt} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')


module.exports = {	

	async create (req,res,next) {
		try {			
			const event = await Event.findOne({where: { id: req.body.event_id} })

			sequelize.transaction( t => {
				return event.update({ 
					other: event.inout + req.body.amount, 
					cash: event.cash + req.body.amount,
					balance: event.balance + req.body.amount
				}, { transaction:t })
				.then(()=>{
					return Inout.create(req.body, {transaction: t})
				})
			})				
			.then(result => { res.send(result) })
			.catch(err => { res.send(err) })
		
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	// async show (req,res,next){
	// 	try {
	// 		const debt = await Debt.findByPk(req.params.debtId)
	// 		if (!debt) res.status(404).send({ error: 'Data not found'})
	// 		res.send(debt)
	// 	} catch(err){
	// 		res.status(500).send( {error: err} )
	// 	}
	// },	

	async index (req,res){
		try {
			const inouts = await Inout.findAll({
				include: [{ model: Member, attributes:['id', 'fullname']}, { model: Event, attributes: ['date'] }],
				order: [[ Event, 'date', 'desc']]

			})						

			res.send(inouts)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	// async update(req,res,next){
	// 	try{
	// 		const debt = await Debt.findByPk(req.params.debtId)
	// 		if(!debt) {
	// 			res.status(404).send({ error: "Data not found"})
	// 		} else {
	// 			const debtBefore = debt.amount
	// 			sequelize.transaction( t => {
				 		
	// 			  return debt.update(req.body, {transaction: t})

	// 			  .then(newDebt => {
	// 			  	return Event.findOne({ where: { id: newDebt.event_id }}, { transaction: t})
	// 			  	.then(event=>{
	// 			  		return event.update( {debt: (parseInt(event.debt)  + parseInt(req.body.amount) - parseInt(debtBefore)) }, {transaction: t})
	// 			  	})
	// 			  })
	// 			})				
	// 			.then(result => {  
	// 				res.send(result)
	// 			})
	// 			.catch(err => {
	// 				res.send(err)
	// 			});


	// 		}

	// 	} catch (err){
	// 		res.status(500).send({ error: err})
	// 	}
	// },

	// async delete (req,res,next){
	// 	try {						
	// 		sequelize.transaction( t => {
			 		
	// 		  return Debt.findByPk(req.params.debtId, {transaction: t})

	// 		  .then(debt => {
	// 		  	if (!debt) {
	// 		  		res.status(404).send({ error: 'Data not found'})
	// 		  	} else {
	// 		  		return debt.destroy({transaction: t})
	// 		  		.then(deletedDebt=>{
	// 		  			return Event.findOne({ where: { id: deletedDebt.event_id }}, {transaction: t})
	// 			  		.then(event=> {			  				
	// 			  			return event.update( {debt: parseInt(event.debt) - parseInt(deletedDebt.amount) }, {transaction: t})
	// 			  		})
	// 		  		})
	// 		  	}			  		
	// 		  })

	// 		})
	// 		 .then(result => {  
	// 			res.send(result)
	// 		})
	// 		.catch(err => {
	// 			res.send(err)
	// 		});
			
	// 	} catch(err) {
	// 		res.status(500).send({ error: err})
	// 	}
	// }
}