const {Installment, Debt, Member} = require('../models');
const config = require('../configs/config.js');
const Moment = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports = {	

async autoCreate(req,res,next) {	
		try{
			const today = Moment()
			
			const debts = await Debt.findAll({
				where: { amount: {[Op.ne]: Sequelize.col('paid')} }
				,include: [{ model: Installment, attributes: [] }]
				,attributes: {include: [[Sequelize.fn("count", Sequelize.col("Installments.amount")), "installmentCount"]]}
				,group: ['Debt.id']
			})
			
			debts.forEach(function(debt){
				const minPay = debt.amount/config.payTimes

				if(debt.dataValues.installmentCount < config.payTimes){

					Installment.findOne({
						where: { debt_id: debt.id },
						order: [['date', 'desc' ]]
					})
					.then((installment)=>{						
						if(!installment || Moment(installment.date).format('MMYY') != Moment().format('MMYY') ){
							Installment.create({
								debt_id: debt.id,
								date: today,
								amount: minPay,	
								note: debt.dataValues.installmentCount + 1
							})
						}
						
					})
				} else {
					console.log("Member " + debt.id + " has reach " + debt.dataValues.installmentCount + " installments")
				}
				
			})

			res.send(debts)

		} catch (err){
			res.status(500).send({ error: err})
		}
	},	

	// async create (req,res,next) {
	// 	try{
	// 		const member = await Member.findByPk(req.body.member_id)
	// 		if(!member) res.status(404).send({ error: "Data not found"})
			
	// 		if(member.debt != 0) res.status(202).send({ error: "Failed to create new data"})
			
	// 		const debt = await Debt.create(req.body)
	// 		await member.update({ debt: req.body.amount})			
	// 		res.status(201).send(debt)
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
			const installment = await Installment.findAll()
			res.send(installment)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const installment = await Installment.findByPk(req.params.installmentId)
			if(!installment) res.status(404).send({ error: "Data not found"})

			const debt = await Debt.findByPk(req.body.debt_id)
			if(!debt) res.status(404).send({ error: "Data not found"})

			const debtPaidBefore = debt.paid
			if( (installment.has_paid === true) && (req.body.has_paid === true) ){				
				const debtPaidAfter = (debtPaidBefore - installment.amount) + req.body.amount
				await debt.update({ paid: debtPaidAfter })
			} 
			
			if((installment.has_paid === true) && (req.body.has_paid === false) ){
				const debtPaidAfter = debtPaidBefore - installment.amount
				await debt.update({ paid: debtPaidAfter })
			} 

			if((installment.has_paid === false) && (req.body.has_paid === true)){
				const debtPaidAfter = debtPaidBefore + req.body.amount
				await debt.update({ paid: debtPaidAfter })
			} 

			await installment.update(req.body)
			res.send(installment)
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const installment = await Installment.findByPk(req.params.installmentId)
			if (!installment) res.status(404).send({ error: 'Data not found'})
			
			await installment.destroy()
			const debt = {}
			if(installment.has_paid === true){
				debt = await Debt.findByPk(installment.debt_id)
				if(!debt) res.status(404).send({ error: "Data not found"})
				const debtPaidBefore = debt.paid
				const debtPaidAfter = debtPaidBefore - installment.amount
				await debt.update({paid: debtPaidAfter})			
			}

			res.send({installment, debt})

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