const {Installment, Debt, Member, Event} = require('../models');
const config = require('../configs/config.js');
const Moment = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')


module.exports = {	

	async create (req,res,next) {
		try{
			const installment = await Installment.findOne({ where: { event_id: req.body.event_id, debt_id: req.body.debt_id } })						

			if(installment){
				res.status(400).send({ error: "Tagihan bulan ini telah dibuat"})
			} else {				

				const event = await Event.findOne({ where: { id: req.body.event_id }})
				const debt = await Debt.findOne({where: {id: req.body.debt_id}})				
				
				if(!debt) {
					res.status(404).send({ error: "Data not found"})
				} else {
					const minus = debt.amount - debt.paid					
					if( minus > 0 ){
						if(req.body.amount > minus) {
							req.status(400).send("Cicilan maksimal adalah"+ toMoney(minus) )
						}					
						if(req.body.has_paid === true){
							sequelize.transaction( t => {
							 	return event.update({
							 		installment: event.installment + req.body.amount,
							 		cash: event.cash + req.body.amount
							 	}, {transaction:t})
							 	.then(()=>{						 		
							 		return debt.update({ paid: paid + req.body.amount}, {transaction:t})
							 		.then(()=>{
							 			return Installment.create(req.body, {transaction:t})
							 		})
								})
							})				
							.then(result => {  res.send(result) })
							.catch(err => { res.send(err) });
						} else {
							const newIns = await Installment.create(req.body)
							res.send(newIns)
						}

					}	else {
						res.status(400).send({ error: "Semua tagihan sudah dibuat"})
					}
				}
			}
		
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async show (req,res,next){
		try {
			const debt = await Debt.findByPk(req.params.debtId)
			if (!debt) res.status(404).send({ error: 'Data not found'})
			res.send(debt)
		} catch(err){
			res.status(500).send( {error: err} )
		}
	},	

	async index (req,res,next){
		try {
			const installments = await Installment.findAll({
				include: [
					{	model:Debt, attributes: ['id'], include:[ { model:Member, attributes: ['id', 'fullname'] }] },
					{ model:Event, attributes:['id', 'date'] }
				],
				order: [ [ Debt, Member, 'fullname', 'desc' ], ['id', 'desc']]
			})
			res.send(installments)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const installment = await Installment.findByPk(req.params.installmentId)
			if(!installment) {
				res.status(404).send({ error: "Data not found"})
			} else {

				const oldEvent = await Event.findOne({ where: { id: installment.event_id }})
				const newEvent = await Event.findOne({ where: { id: req.body.event_id }})
				const debt = await Debt.findOne({where: {id: req.body.debt_id}})						

				const newDebtPaid = oldEvent ? debt.paid - installment.amount + req.body.amount : debt.paid + req.body.amount
				
				sequelize.transaction( t => {
					return newEvent.update({
			 			installment: newEvent.installment + req.body.amount,
			 			cash:  newEvent.cash + req.body.amount
			 		}, {transaction:t})
					.then(()=>{
						return debt.update({ paid: newDebtPaid }, {transaction:t})
						.then(()=>{
							return installment.update(req.body, {transaction:t})
						})
					})
				})
				.then(result => { res.send(result) })
				.catch(err => { res.send(err) });
			}
			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const installment = await Installment.findByPk(req.params.installmentId)
			if (!installment) {
				res.status(404).send({ error: 'Data not found'})
			} else {
				const debt = await Debt.findByPk(installment.debt_id)
				const opUpdate = (installment.has_paid === true) ? debt.paid - installment.amount : debt.paid
				const event = await Event.findOne({ where: {id: installment.event_id} })
				
				if(installment.has_paid === true){
					sequelize.transaction( t => {				
						return debt.update({ paid: opUpdate },{ transaction:t})	
						.then(()=>{
							return event.update( { 
								cash: event.cash - installment.amount,
								installment: event.installment - installment.amount 
							},{transaction:t })
							.then(()=>{
								return installment.destroy({ transaction: t})		
							})						
						})
					})
					.then(result => {res.send(result)})
					.catch(err => {res.send(err)})		
				} else {
					installment.destroy()
					res.send(installment)
				}
			}		
		} catch(err) {
			res.status(500).send({ error: err})
		}
	}
}


// async function sumSaving (memberId){
// 	try {
// 		const member = await Member.findOne({
// 			where: { id: memberId }
// 			,include: [{ model: Saving, attributes: [] }]			
// 			,attributes: {include: [[Sequelize.fn("sum", Sequelize.col("Savings.amount")), "savingSum"]]}
// 		})
// 		if (!member.id) { 
// 			return 0
// 		} else {			
// 			return member
// 		}
// 	} catch(err) {		
// 		console.log(err)
// 	}		
// }

function toMoney(val){
  return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}