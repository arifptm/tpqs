const {Saving, Member, Event} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;



module.exports = {	

	async create (req,res,next) {
		try{
			const member = await Member.findByPk(req.body.member_id)
			const balanceBefore = (member) ? member.saving : 0
			const balanceAfter = balanceBefore + req.body.amount
			
			const saving = await Saving.create(req.body)
			saving.dataValues.balanceBefore = balanceBefore
			saving.dataValues.balanceAfter = balanceAfter
			await member.update({ balance: balanceAfter})			
			res.status(201).send(saving)
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async show (req,res,next){
		try {
			const saving = await Saving.findByPk(req.params.savingId)
			if (!saving) res.status(404).send({ error: 'Data not found'})
			res.send(saving)
		} catch(err){
			res.status(500).send( {error: err} )
		}
	},	

	async index (req,res){
		try {
			const savings = await Saving.findAll({
				include: [{ model: Member, attributes: ['fullname'] }, {model: Event, attributes:[ 'date' ]}]
			})
			res.send(savings)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const saving = await Saving.findByPk(req.params.savingId)
			if(!saving) res.status(404).send({ error: "Data not found"})

			const member = await Member.findByPk(req.body.member_id)
			const balanceBefore = (member) ? member.saving : 0
			const balanceAfter = balanceBefore - saving.amount + req.body.amount

			await saving.update(req.body)
			saving.dataValues.balanceBefore = balanceBefore
			saving.dataValues.balanceAfter = balanceAfter
			await member.update({ balance: balanceAfter})	
			res.send(saving)			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const saving = await Saving.findByPk(req.params.savingId)		
			if (!saving) { 
				res.status(404).send({ error: 'Data not found'})
			} else {				
				const member = await Member.findByPk(saving.member_id)

				const balanceBefore = (member) ? member.saving : 0
				const balanceAfter = balanceBefore + (saving.amount * -1)

				await saving.destroy()
				saving.dataValues.balanceBefore = balanceBefore
				saving.dataValues.balanceAfter = balanceAfter
				await member.update({ balance: balanceAfter})
				res.send(saving)
			}

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