const {Installment, Debt, Member, Event} = require('../models');
const config = require('../configs/config.js');
const Moment = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')


module.exports = {	

	async create (req,res,next) {
		try{			
			const debt = await Debt.findOne({ where: { id: req.body.debt_id } })	
			if(!debt) return res.status(400).send({ error: "Data pinjaman tidak ditemukan"})

			var billedOnArray = []
			const installments = await Installment.findAll({ where: { debt_id: req.body.debt_id } })			
			for (var i = installments.length - 1; i >= 0; i--) {
				billedOnArray.push(installments[i].billed_on)
			}

			if(billedOnArray.includes(req.body.billed_on)) return res.status(400).send({ error: "Tagihan bulan ini telah dibuat"})				
			
			if(req.body.event_id !== null){
				const event = await Event.findOne({ where: { id: req.body.event_id }})
				if (!event) return res.send({ error: "Data kegiatan tidak ditemukan"})

				const minus = debt.amount - debt.paid
				if(req.body.amount > minus) return req.status(400).send("Cicilan maksimal adalah"+ toMoney(minus))
						
				sequelize.transaction( t => {
				 	return event.update({
				 		installment: event.installment + req.body.amount,
				 		cash: event.cash + req.body.amount,
				 		balance: event.balance + req.body.amount
				 	}, {transaction:t})
				 	.then(()=>{						 		
				 		return debt.update({ paid: debt.paid + req.body.amount}, {transaction:t})
				 		.then(()=>{
				 			return Installment.create(req.body, {transaction:t})
				 		})
					})
				})				
				.then(result => {  res.send(result) })
				.catch(err => { res.send(err) });				
				
			}	else {
				const newInstallment = await Installment.create(req.body)
				res.send(newInstallment)
			}
		
		} catch (err){
			console.log(err)
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
				order: [ [ 'billed_on', 'desc' ],[Debt,Member,'fullname','asc']]
				//order: [ [ Debt, Member, 'fullname', 'desc' ], ['id', 'desc']]
			})
			res.send(installments)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const installment = await Installment.findByPk(req.params.installmentId)
			if(!installment) return res.status(404).send({ error: "Data cicilan tidak ditemukan"})
			
			const debt = await Debt.findOne({where: {id: req.body.debt_id}})
			if(!debt) return res.status(404).send({ error: "Data pinjaman tidak ditemukan"})

			if(installment.event_id && req.body.event_id){

				sequelize.transaction( t => {
					return Event.findOne({where:{id:installment.event_id}}, {transaction:t})
					.then(oldE=>{
						return oldE.update({
							installment: oldE.installment - installment.amount,
					 		cash:  oldE.cash - installment.amount,
					 		balance: oldE.balance - installment.amount
						}, {transaction:t}).then(()=>{
							return Event.findOne({where:{id:req.body.event_id}}, {transaction:t})
							.then(newE=>{
								return newE.update({
						 			installment: newE.installment + req.body.amount,
						 			cash: newE.cash + req.body.amount,
						 			balance: newE.balance + req.body.amount
						 		}, { transaction:t})
								.then(()=>{
									return debt.update({ paid: debt.paid - installment.amount + req.body.amount }, {transaction:t})
									.then(()=>{
										return installment.update(req.body, {transaction:t})
									})
								})
							})
						})
					})
				})
				.then(result => { res.send(result) })
				.catch(err => { res.send(err) });					
			}

			if(installment.event_id && !req.body.event_id){
				
				sequelize.transaction( t => {
					return Event.findOne({where:{id:installment.event_id}},{transaction:t})
					.then(event=>{					
						return event.update({
				 			installment: event.installment - installment.amount,
				 			cash: event.cash - installment.amount,
				 			balance: event.balance - installment.amount
				 		}, { transaction:t})
						.then(()=>{
							return debt.update({ paid: debt.paid - installment.amount }, {transaction:t})
							.then(()=>{
								return installment.update(req.body, {transaction:t})
							})
						})
					})
				})
				.then(result => { res.send(result) })
				.catch(err => { res.send(err) });					

			}

			if(!installment.event_id && req.body.event_id){
				sequelize.transaction( t => {
					return Event.findOne({where:{id:req.body.event_id}},{transaction:t})
					.then(event=>{						
						return event.update({
				 			installment: event.installment + req.body.amount,
				 			cash: event.cash + req.body.amount,
				 			balance: event.balance + req.body.amount
				 		}, { transaction:t})
						.then(()=>{
							return debt.update({ paid: debt.paid + req.body.amount }, {transaction:t})
							.then(()=>{
								return installment.update(req.body, {transaction:t})
							})
						})
					})	
				})
				.then(result => { res.send(result) })
				.catch(err => { res.send(err) });					
			}			

			if(!installment.event_id && !req.body.event_id){
				installment.update(req.body)
				res.send(installment)
			}
				
			
			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const installment = await Installment.findByPk(req.params.installmentId)
			if (!installment) return res.status(404).send({ error: 'Data cicilan tidak ditemukan'})
			
			const debt = await Debt.findByPk(installment.debt_id)
							
			if(installment.event_id){
				const event = await Event.findOne({ where: {id: installment.event_id} })
				sequelize.transaction( t => {
					return debt.update({ paid: debt.paid - installment.amount  },{ transaction:t})	
					.then(()=>{
						return event.update( { 							
							installment: event.installment - installment.amount,
							cash: event.cash - installment.amount,
							balance: event.balance - installment.amount,
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