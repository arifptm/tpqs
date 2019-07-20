const {Debt, Member, Event} = require('../models');
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports = {	

	async create (req,res,next) {
		try{
			const member = await Member.findByPk(req.body.member_id)
			if(!member) {
				res.status(404).send({ error: "Data not found"})
			} else {			
				if(member.debt != 0) { 
					res.status(202).send({ error: "Failed to create new data"})
				} else {				
					const debt = await Debt.create(req.body)
					await member.update({ debt: req.body.amount})			
					res.status(201).send(debt)
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

	async index (req,res){
		try {
			const debts = await Debt.findAll({
				where: { amount: {[Op.ne]: Sequelize.col('paid')} }
				,include: [{ model: Member, attributes: ['fullname'] }, { model: Event, attributes: [ 'date']}]
			})			
			debts.map((debt) => debt.dataValues.rest = debt.amount - debt.paid)

			res.send(debts)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const debt = await Debt.findByPk(req.params.debtId)
			if(!debt) res.status(404).send({ error: "Data not found"})

			const member = await Member.findByPk(req.body.member_id)
			if(!member) res.status(404).send({ error: "Data not found"})

			await debt.update(req.body)		
			await member.update({ debt: req.body.amount})	
			res.send(debt)
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const debt = await Debt.findByPk(req.params.debtId)		
			if (!debt) res.status(404).send({ error: 'Data not found'})

			//gak bisa dihapus jika masih ada cicilan
						
			// const member = await Member.findByPk(debt.member_id)


			// 	const balanceBefore = (member) ? member.saving : 0
			// 	const balanceAfter = balanceBefore + (saving.amount * -1)

			// 	await saving.destroy()
			// 	saving.dataValues.balanceBefore = balanceBefore
			// 	saving.dataValues.balanceAfter = balanceAfter
			// 	await member.update({ balance: balanceAfter})
			// 	res.send(saving)
			

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