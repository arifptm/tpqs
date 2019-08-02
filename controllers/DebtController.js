const {Debt, Member, Event, Inout, Installment} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')

function toMoney(val){
  return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}


module.exports = {	

	async create (req,res,next) {
		try{

			const debts = await Debt.findAll({
				where: {member_id: req.body.member_id},
				attributes: [
					[ Sequelize.fn("sum", Sequelize.col("amount")), "amountSum" ],
					[ Sequelize.fn("sum", Sequelize.col("paid")), "paidSum" ]
				]				
			})
			const restSum = debts[0].dataValues.amountSum - debts[0].dataValues.paidSum

			const event = await Event.findByPk(req.body.event_id)
			const member = await Member.findByPk(req.body.member_id)

			if( restSum == 0 ){
				sequelize.transaction( t => {
					return event.update({
		  			debt: event.debt + req.body.amount,
	  				other: event.other + (req.body.amount * 0.05),
	  				cash: event.cash - (req.body.amount * 0.95)
	  			}, {transaction: t})
					.then(()=>{
		  			return Debt.create(req.body, {transaction:t})
		  			.then(debt=>{
		  				return Inout.create({
		  					note: "Sumbangan RT ("+ member.alias +": "+toMoney(req.body.amount)+")", 
				  			amount: req.body.amount * 0.05,
				  			debt_id: debt.id,
				  			event_id: req.body.event_id,
				  			member_id: req.body.member_id
				  		}, {transaction: t})
		  			})		  			
		  		})				
					.then(result => {  res.send(result) })
					.catch(err => { res.send(err) });
				})

			} else {
			 	res.status(403).send({ error: "Tidak diijinkan, periksa data pinjaman."})
			}

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
			const debts = await Debt.findAll({
				where: { amount: {[Op.ne]: Sequelize.col('paid')} }
				,include: [{ model: Member, attributes: ['fullname'] }, { model: Event, attributes: ['date']}]
				,order: [['id', 'desc']]
			})			
			debts.map((debt) => debt.dataValues.rest = debt.amount - debt.paid)

			res.send(debts)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const debt = await Debt.findOne({
				where: {id: req.params.debtId},
				include: [
					{ model: Member, attributes: ['id', 'alias']},
					{ model: Event }
				]
			})
			if(!debt) {
				res.status(404).send({ error: "Data not found"})
			} else {				
				sequelize.transaction( t => {
					return Event.update({
			  		debt: debt.Event.debt - debt.amount + req.body.amount,
			  		other: debt.Event.other - (debt.amount * 0.05) + (req.body.amount * 0.05) ,
			  		cash: debt.Event.cash + (debt.amount * 0.95) - (req.body.amount * 0.95)
			  	}, { where:{ id: debt.event_id }, transaction: t})
			  	.then(()=>{ 
						return Inout.update( {
				  		note: "Sumbangan RT ("+debt.Member.alias+": "+toMoney(req.body.amount)+")", 
			  			amount: req.body.amount * 0.05			  			
				  	}, { where: { debt_id: debt.id}, transaction:t})
				  	.then(()=> {
				  		return debt.update(req.body, { where: { id: req.params.debtId}, transaction: t})				 
				  	})
					})
				})				
				.then(result => {  
					res.send(result)
				})
				.catch(err => {
					res.send(err)
				});

			}

		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {			
			const debt = await Debt.findOne({ 
				where: {id: req.params.debtId}
				,include: [ {model: Event } ]
			})
			if (!debt) {
				res.status(404).send({ error: "Data not found"})
			} else {

				sequelize.transaction( t => {
					return Installment.destroy({where:{debt_id: debt.id}, transaction: t})
					.then(()=>{
						return Event.update({
							debt: debt.Event.debt - debt.amount,
							other: debt.Event.other - debt.amount * 0.05,
							cash: debt.Event.cash + debt.amount * 0.95
						}, { where: { id: debt.Event.id}, transaction: t})
						.then(()=>{
							return Inout.destroy( { where: { debt_id: req.params.debtId}, transaction: t})
		  				.then(()=>{ 		  		
		  					return debt.destroy({transaction: t })		  					
		  				})
	  				})
		  		})		  
				})
				.then(result => {  
					res.send(result)
				})
				.catch(err => {
					res.send(err)
				});

			}
			
		} catch(err) {
			res.status(500).send({ error: err})
		}
	},


	async debtInstallments(req,res,next){
		try{

			const installments = await Debt.findOne({
				where: {id: req.params.debtId},
				include: [{
					model: Installment, 
					include: [ {model: Event, attributes: [ 'id', 'date']}]
				}],				
				order: [[ Installment, {model: Event}, 'date', 'desc' ]]
			})
			res.send(installments)
		} catch(err) {
			res.status(500).send({ error: err})
		}
	}


}