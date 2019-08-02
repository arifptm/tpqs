const {Event, Member, Debt, Installment, Saving} = require('../models');
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
				await autoCreateInstallment(newEvent.date)
				res.send(newEvent)
			}
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
				
				// where: { amount: {[Op.ne]: Sequelize.col('paid')} }
				// ,include: [					
				// 	{ model: Debt,
				// 		include: { model: Installment, where: { has_paid: true } }
				// 	}
				// ]
				// ,attributes: {
				// 	include: [[Sequelize.fn("sum", Sequelize.col("Debts.amount")), "debtSum"]]
				// }


					// { model: Member, 
					// 	attributes: ['fullname', 'alias'] 
					// },
					// { model:Installment, where: {has_paid: true}, attributes:[]} 
					// ,attributes: { include: [[Sequelize.fn("sum", Sequelize.col("Installment.amount")), "installmentSum"]] }
					// 	,group: ['Debt.id']
					// }
					// { model: Saving, attributes: []}
				
				// ,attributes: {include: [
					// [Sequelize.fn("sum", Sequelize.col("Debts.Installments.amount")), "installmentSum"]
					// ,[Sequelize.fn("sum", Sequelize.col("Savings.amount")), "savingSum"]
				// ]}

				// ,group: ['Event.id']
						
			// debts.map((debt) => debt.dataValues.rest = debt.amount - debt.paid)

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
			
			if (!event) {				
				res.status(404).send({ error: 'Data not found'})
			} else {

				await event.Debts.forEach(debt=>{
					Installment.destroy({ where: {debt_id: debt.id} })
				})				

				await Debt.destroy({where: { event_id: event.id }})

				event.destroy()

				// if (event.Debt.Installment){
				// 	// event.destroy().then(()=>res.send("Data deleted"))
				// 	res.send('siap')
				// } else {
				// 	res.status(403).send('Child data exist')
				// }
				res.send(event)
			}			

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
			if(!event) { 
				res.status(404).send({ error: "Data not found"})
			} else {				
				await event.update(req.body)
				res.send(event)
			}
		} catch (err){
			res.status(500).send({ error: err})
		}
	}


}

async function autoCreateInstallment(event_date) {
	try{
		const debts = await Debt.findAll({
			where: { amount: {[Op.ne]: Sequelize.col('paid')} }
			,include: [{ model: Installment, attributes: [] }]			
		})
		
		debts.forEach(function(debt){
			var minPayment = Math.trunc(debt.amount / debt.paytimes)

			if(debt.amount > debt.paid ){
				Installment.findOne({
					where: { debt_id: debt.id, billed_on: event_date}
				})
				.then(installment => {
					if(!installment) 	{					
						Installment.create({
							billed_on: event_date,
							debt_id: debt.id,							
							amount: minPayment
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
