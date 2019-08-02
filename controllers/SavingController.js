const {Saving, Member, Event} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const {sequelize} = require('../models')



module.exports = {	

	async create (req,res,next) {
		try{
			const event = await Event.findByPk(req.body.event_id)
			
			sequelize.transaction( t => {			
				return event.update({ 
					saving: event.saving + req.body.amount,
					cash: event.cash + req.body.amount
				},{ transaction:t})
				.then(()=>{
					return Saving.create(req.body, { transaction: t})	
				})
			})

			.then(result => { res.send(result) })
			.catch(err => { res.send(err) });
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async show (req,res,next){
		// try {
		// 	const saving = await Saving.findByPk(req.params.savingId)
		// 	if (!saving) res.status(404).send({ error: 'Data not found'})
		// 	res.send(saving)
		// } catch(err){
		// 	res.status(500).send( {error: err} )
		// }
	},	

	async index (req,res){
		try {
			const savings = await Saving.findAll({
				include: [ {model: Member, attributes: ['id', 'fullname'] }, {model: Event, attributes:['id', 'date']}],
				order: [['id', 'desc']]
			})
			res.send(savings)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const saving = await Saving.findOne({ where: { id: req.params.savingId }})
			const event = await Event.findByPk(saving.event_id)

			sequelize.transaction( t => {
				return event.update({ 
					saving: event.saving - saving.amount + req.body.amount,
					cash: event.cash - saving.amount + req.body.amount
				},{ transaction:t})
				.then(()=>{
					return saving.update(req.body, { transaction: t})	
				})
			})				
			.then(result => { res.send(result) })
			.catch(err => { res.send(err) });		
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const saving = await Saving.findOne({ where: { id: req.params.savingId }})
			const event = await Event.findByPk(saving.event_id)

			sequelize.transaction( t => {
				return event.update({ 
					saving: event.saving - saving.amount,
					cash: event.cash - saving.amount
				},{ transaction:t})
				.then(()=>{
					return saving.destroy({ transaction: t})	
				})
			})				
			.then(result => { res.send(result) })
			.catch(err => { res.send(err) });	
		} catch(err) {
			res.status(500).send({ error: err})
		}
	}
}


async function sumSaving (memberId){
	try {
		const member = await Member.findOne({
			where: { id: memberId }
			,include: [{ model: Saving, attributes: [] }]			
			,attributes: {include: [[Sequelize.fn("sum", Sequelize.col("Savings.amount")), "savingSum"]]}
		})
		if (!member.id) { 
			return 0
		} else {			
			return member
		}
	} catch(err) {		
		console.log(err)
	}		
}