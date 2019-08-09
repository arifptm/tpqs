const {Member, Debt, Saving, Event} = require('../models');
const config = require('../configs/config.js');
const {addImage} = require('../configs/multer.js');
const fs = require('fs-extra');
const Sequelize = require('sequelize')
// const Op = Sequelize.Op;

module.exports = {	

	async nameList(req, res, next){
		try{
			const members = await Member.findAll({
				attributes: [ 'fullname', 'alias', 'id'],
				order: [ 'fullname']
			})
			res.send(members)
		} catch(err){
			res.status(500).send({ error: err})
		}

	},

	// async memberSavings(req, res, next){
	// 	try{

	// 		const member = await Member.findOne({
	// 			where: {id: req.params.memberId},
	// 			include: [ { model: Saving }]
	// 		})
	// 		res.send(member)

	// 	} catch(err){
	// 		res.status(500).send({ error: err})
	// 	}
	// },

	async create (req,res,next) {		
		try{
			if(req.file){
				if(req.file.filename) {
					req.body['image'] = await addImage(req.file.filename, config.storage.members)
				}
			}			
			const member = await Member.create(req.body)			
			res.status(201).send(member)
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async show (req,res,next){
		try { 			
			const member = await Member.findAll({ where: {id: req.params.memberId}, order:[[ 'id', 'desc' ]]})
			if (!member) res.status(404).send({ error: 'Data not found'})
			res.send(member)
		} catch(err){
			res.status(500).send( {error: err} )
		}
	},	

	async index (req,res){
		try {
			const members = await Member.findAll({
				include:  [ { model: Saving, include: { model:Event, attributes: ['id', 'date'] }},  { model: Debt, include: { model:Event, attributes: ['id', 'date'] }}],
				order: [
					[{model: Saving}, {model: Event}, 'date', 'desc'], [{model: Saving}, 'id', 'desc'],
					[{model: Debt}, {model: Event}, 'date', 'desc'], [{model: Debt}, 'id', 'desc']
				] 
			})
			members.map((m)=> {
				m.dataValues.debtSum = (m.dataValues.Debts.reduce((a,b)=> a + b['amount'],0 )) 
				m.dataValues.paidSum = (m.dataValues.Debts.reduce((a,b)=> a + b['paid'],0 )) 
				m.dataValues.savingSum = (m.dataValues.Savings.reduce((a,b)=> a + b['amount'],0 )) 				
				m.dataValues.restSum = (m.dataValues.debtSum - m.dataValues.paidSum) 
			})
			// members.map((m)=> m.dataValues.restSum = (m.dataValues.debtSum - m.dataValues.paidSum) )
			res.send(members)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const member = await Member.findByPk(req.params.memberId)
			if(!member) res.status(404).send({ error: "Data not found"})
			
			if(req.file){					
				if(req.file.filename) {
					req.body['image'] = await addImage(req.file.filename, config.storage.members)
					if(member.image) deleteImage(member.image)
				}
			}
			await member.update(req.body)
			res.send(member)			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const member = await Member.findByPk(req.params.memberId)
			if (!member) { 
				res.status(404).send({ error: 'Data not found'})
			} else {
				await member.destroy()
				await deleteImage(member.image)
				res.send(member)
			}
		} catch(err) {
			res.status(500).send({ error: err})
		}
	},

	async memberSavings (req,res,next){
		try {
			const member = await Member.findOne({
				where: { id: req.params.memberId }
				,include: [{ model: Saving, include:{model: Event, attributes: ['date']} }]
				,order: [[ { model: Saving }, 'id', 'desc' ]]
				// ,attributes: {include: [[Sequelize.fn("sum", Sequelize.col("Savings.amount")), "savingSum"]]}
			})						
			if (!member.id) { 
				res.status(404).send({ error: 'Data not found'})
			} else {
				member.dataValues.savingSum  = member.Savings.reduce((a,b) => a + b['amount'], 0)				
				res.send(member)
			}
		} catch(err) {
			res.status(500).send({ error: err})
		}
	},

	async memberDebts (req,res,next){
		try {
			const member = await Member.findOne({
				where: { id: req.params.memberId }
				,include: [{ model: Debt, include:{model: Event, attributes: ['date']} }]
				,order: [[ { model: Debt }, 'id', 'desc' ]]
				// ,attributes: {include: [[Sequelize.fn("sum", Sequelize.col("Savings.amount")), "savingSum"]]}
			})						
			if (!member.id) { 
				res.status(404).send({ error: 'Data not found'})
			} else {
				// member.dataValues.savingSum  = member.Savings.reduce((a,b) => a + b['amount'], 0)				
				res.send(member)
			}
		} catch(err) {
			res.status(500).send({ error: err})
		}
	}

}

function deleteImage(item){
	let originalImage = './' + config.storage.members + '/' + item
	let thumbImage = './' + config.storage.members + '/thumb/' + item
	if (fs.existsSync(originalImage)) { fs.unlink(originalImage, (err)=>{ console.log(err)}) }
	if (fs.existsSync(thumbImage)) { fs.unlink(thumbImage, (err)=>{ console.log(err) })	}		
	return item
} 