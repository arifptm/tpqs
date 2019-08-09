const {Event, Member, Debt, Installment, Saving} = require('../models');
const Moment = require('moment')
const config = require('../configs/config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')



module.exports = {	

	async create (req,res,next) {
		try{
			const a = Moment(req.body.date).startOf('month')			
			const b = Moment(req.body.date).endOf('month')
			const event = await Event.findOne({ where: { date: {[Op.between]: [a,b]} }} )
			if (event) return res.status(500).send("Bulan ini sudah ada pertemuan")

			const lastEvent = await Event.findOne({ order: [[ 'date', 'desc']] })
			if (!lastEvent) return res.status(500).send("Belum pernah ada pertemuan")
			
			req.body['last_balance'] = lastEvent.balance
			req.body['balance'] = lastEvent.balance

			const newEvent = await Event.create(req.body)
			await autoCreateInstallment(newEvent.date)
			res.send(newEvent)
			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async index (req,res){
		try {
			const events = await Event.findAll({
				order:[[ 'date', 'desc']],
				include: [
					{ model: Member, attributes: [ 'fullname' ] }					
				]
			})			
			res.send(events)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const event = await Event.findOne({
				where: { id: req.params.eventId }
				,include: [{ model: Debt, attributes: ['id']}]
			})					

			if (!event) return res.status(404).send({ error: 'Data not found'})

			await event.Debts.forEach(debt=>{
				Installment.destroy({ where: {debt_id: debt.id} })
			})							
			await Debt.destroy({where: { event_id: event.id }})
			event.destroy()

			res.send(event)

		} catch(err) {
			res.status(500).send({ error: err})
		}
	},

	async dateList(req, res, next){
		try{
			const events = await Event.findAll({
				attributes: [ 'date', 'id'],
				order: [['date', 'desc']]
			})
			res.send(events)
		} catch(err){
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



	async update(req,res,next){
		try{
			const event = await Event.findByPk(req.params.eventId)
			if(!event) return res.status(404).send({ error: "Data not found"})

			sequelize.transaction( t => {
				return Installment.update({ billed_on: req.body.date },{ where: {billed_on: event.date}, transaction: t })
				.then(()=>{
					return event.update(req.body, {transaction: t})
				})			
			})				
			.then(result => { res.send(result) })
			.catch(err => { res.send(err) })
			
		} catch (err){
			res.status(500).send({ error: err})
		}
	}	
} 

async function autoCreateInstallment(event_date) {
	try{
		const debts = await Debt.findAll({
			where: { amount: {[Op.ne]: Sequelize.col('paid')} },
			include: [{ model: Installment }]
		})		
		
		debts.forEach(function(debt){
			var minPayment = Math.trunc(debt.amount / debt.paytimes)
			var installmentSum = debt.Installments.reduce((a,b) => a + b['amount'],0 )
			var rest = debt.amount - installmentSum
			if(rest > 0 ){
				var toPay = (rest < minPayment) ? rest : minPayment
				Installment.findOne({
					where: { debt_id: debt.id, billed_on: event_date}
				})
				.then(installment => {
					if(!installment) 	{					
						Installment.create({
							billed_on: event_date,
							debt_id: debt.id,							
							amount: toPay
						})
						console.log("Tagihan baru berhasil telah dibuat")
					} else {
						console.log("Tagihan bulan ini telah dibuat")
					}
					
				})
				
			} else {
				console.log("Tagihan cicilan sudah dibuat semua.")
			}				
		})
		return

	} catch (err){
		res.status(500).send({ error: err})
	}
}
