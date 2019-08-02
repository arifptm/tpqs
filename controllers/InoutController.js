const {Inout, Event, Member, Debt} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')


module.exports = {	

	// async create (req,res,next) {
	// 	try{

	// 		const debt = await Debt.findOne({
	// 			where: {member_id: req.body.member_id},
	// 			include: [{ model: Member, attributes: ['alias']}],
	// 			order: [[ 'event_id', 'DESC' ]]
	// 		})
			
	// 		if( !debt || ((debt.amount - debt.paid) == 0) ){
				 
	// 			sequelize.transaction( t => {
				 		
	// 			  return Debt.create(req.body, {transaction: t})
	// 			  .then(debt=>{  Inout.create({ note: "Sumbangan RT ( "+ debt.Member.alias +"|"+ debt.amount +" )", amount: debt.amount*0.05, event_id: debt.event_id}, {transaction: t})
	// 				  .then(debt => {
	// 				  	return Event.findOne({ where: { id: req.body.event_id }}, { transaction: t})
	// 				  	.then(event=>{
	// 				  		return event.update( {debt: parseInt(event.debt) + parseInt(req.body.amount) }, {transaction: t})
	// 				  	})
	// 				  })
	// 				})
	// 			})				
	// 			.then(result => {  
	// 				res.send(result)
	// 			})
	// 			.catch(err => {
	// 				res.send(err)
	// 			});

	// 		} else {
	// 			res.status(403).send({ error: "Tidak diijinkan, periksa data pinjaman."})
	// 		}

		
	// 	} catch (err){
	// 		res.status(500).send({ error: err})
	// 	}
	// },

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