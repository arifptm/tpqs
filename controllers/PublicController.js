const {Member, Debt, Saving, Event, Inout, Installment} = require('../models');
const config = require('../configs/config.js');
const moment = require('moment')
const {addImage} = require('../configs/multer.js');
const fs = require('fs-extra');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = {	

	async members(req, res, next){
		try{		
			const members = await Member.findAll({
				attributes: [ 'fullname', 'alias', 'id', 'enabled'],
				include: [
					{model:Inout, attributes: ['id', 'note', 'amount'], include:[ { model:Event, attributes: ["date"] } ] },
					{model:Saving, attributes: ['id', 'note', 'amount'], include:[ { model:Event, attributes: ["date"] } ] },
					{	model:Debt, required: false,
						include: [
							{model:Event, attributes: ["date"]},
							{model:Installment, attributes:["id", "billed_on", "amount", "note" ], include: {model:Event, attributes: ["id", "date"] }}
						],
						attributes: ['amount', "note", "paid"]
					}
				],
				order: [
					[ 'fullname' ], 
					[ Inout, Event, 'date', 'desc' ],
					[ Saving, Event, 'date', 'desc' ], 
					[ Debt, Event, 'date', 'desc' ], 
					[ Debt, Installment, Event, 'date', 'desc' ],
				]
			})

			members.map(m=>{
				m.dataValues.savingSum = (m.dataValues.Savings.reduce((a,b)=> a + b['amount'],0 )) 
				m.dataValues.inoutSum = (m.dataValues.Inouts.reduce((a,b)=> a + b['amount'],0 ))
				if (m.Debts[0]) {
					if(m.Debts[0].amount - m.Debts[0].paid >0){
						var debtDate = m.Debts[0].Event.date						
						m.dataValues.debtDate = debtDate
						m.dataValues.debtAmount = m.Debts[0].amount
						m.dataValues.debtPaid = m.Debts[0].paid
						m.dataValues.debtRest = m.Debts[0].amount - m.Debts[0].paid
						if(m.Debts[0].Installments){
							var di = m.Debts[0].Installments.filter(im => im.Event !== null)
							m.dataValues.lastInstallment = di[0] ? di[0].Event.date : null
							var paidTimes = di.length
							m.dataValues.paidTimes = paidTimes
						}
						var debtDuration = (moment().startOf("month").diff(moment(debtDate).endOf("month"), "month"))
						m.dataValues.debtDuration = debtDuration
					m.dataValues.debtArrears = debtDuration - paidTimes
					}
				}
				

				
				

				// m.dataValues.lastInstallment = m.Debts[0] ? ( m.Debts[0].Installments[0] ? i : null ) : null

			})


			res.send(members)
		} catch(err){
			res.status(500).send({ error: err})
		}
	},

	async events(req, res, next){
		try{	
			const events = await Event.findAll({
				order: [[ "date", "desc" ]],
				include: [
					{model:Member, attributes: [ 'fullname', 'alias']},
					{model:Debt, attribute: ['paid'] }
				],
				where: { date: { [Op.gte] : "2018-01-01" } }
			})

			events.map(m=>{
				m.dataValues.paidSum = (m.dataValues.Debts.reduce((a,b)=> a + b['paid'],0 )) 
			})

			res.send(events)



			// const members = await Member.findAll({
			// 	attributes: [ 'fullname', 'alias', 'id', 'enabled'],
			// 	include: [
			// 		{model:Inout, attributes: ['id', 'note', 'amount'], include:[ { model:Event, attributes: ["date"] } ] },
			// 		{model:Saving, attributes: ['id', 'note', 'amount'], include:[ { model:Event, attributes: ["date"] } ] },
			// 		{	model:Debt, required: false,
			// 			include: [
			// 				{model:Event, attributes: ["date"]},
			// 				{model:Installment, attributes:["id", "billed_on", "amount", "note" ], include: {model:Event, attributes: ["id", "date"] }}
			// 			],
			// 			attributes: ['amount', "note", "paid"]
			// 		}
			// 	],
			// 	order: [
			// 		[ 'fullname' ], 
			// 		[ Inout, Event, 'date', 'desc' ],
			// 		[ Saving, Event, 'date', 'desc' ], 
			// 		[ Debt, Event, 'date', 'desc' ], 
			// 		[ Debt, Installment, Event, 'date', 'desc' ],
			// 	],
			// })

			// members.map(m=>{
			// 	m.dataValues.savingSum = (m.dataValues.Savings.reduce((a,b)=> a + b['amount'],0 )) 
			// 	m.dataValues.inoutSum = (m.dataValues.Inouts.reduce((a,b)=> a + b['amount'],0 ))
			// 	if (m.Debts[0]) {
			// 		if(m.Debts[0].amount - m.Debts[0].paid >0){
			// 			var debtDate = m.Debts[0].Event.date						
			// 			m.dataValues.debtDate = debtDate
			// 			m.dataValues.debtAmount = m.Debts[0].amount
			// 			m.dataValues.debtPaid = m.Debts[0].paid
			// 			m.dataValues.debtRest = m.Debts[0].amount - m.Debts[0].paid
			// 			if(m.Debts[0].Installments){
			// 				var di = m.Debts[0].Installments.filter(im => im.Event !== null)
			// 				m.dataValues.lastInstallment = di[0] ? di[0].Event.date : null
			// 				var paidTimes = di.length
			// 				m.dataValues.paidTimes = paidTimes
			// 			}
			// 			var debtDuration = (moment().startOf("month").diff(moment(debtDate).endOf("month"), "month"))
			// 			m.dataValues.debtDuration = debtDuration
			// 		m.dataValues.debtArrears = debtDuration - paidTimes
			// 		}
			// 	}
				

				
				

			// 	// m.dataValues.lastInstallment = m.Debts[0] ? ( m.Debts[0].Installments[0] ? i : null ) : null

			// })


			// res.send(members)
		} catch(err){
			res.status(500).send({ error: err})
		}
	}


}
