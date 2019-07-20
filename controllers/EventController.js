const {Event, Member, Debt, Installment} = require('../models');
const Moment = require('moment')
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports = {	

	async create (req,res,next) {
		try{
			const a = Moment(req.body.date).startOf('month')			
			const b = Moment(req.body.date).endOf('month')
			const event = await Event.findOne({ where: { date: {[Op.between]: [a,b]} }} )
			if (event){
				res.status(500).send("Bulan ini sudah ada pertemuan")
			} else {				
				const newEvent = await Event.create(req.body)
				await autoCreateInstallment(newEvent.id)
				res.send(newEvent)
			}
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async index (req,res){
		try {
			const events = await Event.findAll({
				order:[[ 'date', 'desc']]
				// where: { amount: {[Op.ne]: Sequelize.col('paid')} }
				,include: [{ model: Member, attributes: ['fullname', 'alias'] }]
			})			
			// debts.map((debt) => debt.dataValues.rest = debt.amount - debt.paid)

			res.send(events)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},





// where: { amount: {[Op.ne]: Sequelize.col('paid')} }
// 		member_id: { type: DataTypes.INTEGER, allowNull: false },
// 		date: { type: DataTypes.DATE, allowNull: false },
// 		note: { type: DataTypes.STRING},
// 		debt: { type: DataTypes.DECIMAL, defaulValue: 0},
// 		saving: { type: DataTypes.DECIMAL, defaulValue: 0},
// 		taken: { type: DataTypes.DECIMAL, defaulValue: 0}

















	// async show (req,res,next){
	// 	try {
	// 		const debt = await Debt.findByPk(req.params.debtId)
	// 		if (!debt) res.status(404).send({ error: 'Data not found'})
	// 		res.send(debt)
	// 	} catch(err){
	// 		res.status(500).send( {error: err} )
	// 	}
	// },	



	// async update(req,res,next){
	// 	try{
	// 		const debt = await Debt.findByPk(req.params.debtId)
	// 		if(!debt) res.status(404).send({ error: "Data not found"})

	// 		const member = await Member.findByPk(req.body.member_id)
	// 		if(!member) res.status(404).send({ error: "Data not found"})

	// 		await debt.update(req.body)		
	// 		await member.update({ debt: req.body.amount})	
	// 		res.send(debt)
	// 	} catch (err){
	// 		res.status(500).send({ error: err})
	// 	}
	// },

	// async delete (req,res,next){
	// 	try {
	// 		const debt = await Debt.findByPk(req.params.debtId)		
	// 		if (!debt) res.status(404).send({ error: 'Data not found'})

	// 		//gak bisa dihapus jika masih ada cicilan
						
	// 		// const member = await Member.findByPk(debt.member_id)


	// 		// 	const balanceBefore = (member) ? member.saving : 0
	// 		// 	const balanceAfter = balanceBefore + (saving.amount * -1)

	// 		// 	await saving.destroy()
	// 		// 	saving.dataValues.balanceBefore = balanceBefore
	// 		// 	saving.dataValues.balanceAfter = balanceAfter
	// 		// 	await member.update({ balance: balanceAfter})
	// 		// 	res.send(saving)
			

	// 	} catch(err) {
	// 		res.status(500).send({ error: err})
	// 	}
	// }
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

async function autoCreateInstallment(meetingId) {
	try{
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
							meeting_id: meetingId,
							amount: minPay,	
							note: debt.dataValues.installmentCount + 1
						})
					}
					
				})
			} else {
				console.log("Member " + debt.id + " has reach " + debt.dataValues.installmentCount + " installments")
			}
			
		})

		return

	} catch (err){
		res.status(500).send({ error: err})
	}
}
