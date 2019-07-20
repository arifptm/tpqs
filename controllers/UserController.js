const {User} = require('../models');
const Auth = require ('../configs/jwAuth');
const config = require('../configs/config.js');
const fs = require('fs-extra');
const Sequelize = require('Sequelize')
const Op = Sequelize.Op;

module.exports = {	

	async register (req,res,next) {
		try{
			const username = await User.findOne({ where: {username: req.body.username }})
			if(username) res.send("Username already registered")
			const email = await User.findOne({ where: {email: req.body.email }})
			if(email) res.send("Email already registered")
			
			if(!username && !email){
				const user = await User.create(req.body)
				const token = await Auth.jwtSignUser({ uid: user.id, email: user.email})
				res.status(201).send({user, token})
			}
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async show (req,res,next){
		try { 			
			const user = await User.findByPk(req.params.userId)
			res.status(200).send(user)
		} catch(err){
			res.status(500).send( {error: err} )
		}
	},	

	async index (req,res){
		try {
			const users = await User.findAll()
			res.send(users)
		} catch ( err) {
			res.status(500).send({ error: err})
		}
	},

	async update(req,res,next){
		try{
			const id = req.params.userId
			const user = await User.findByPk(id)

			const username = await User.findOne({ 
				where: {
					username: req.body.username,
					id: { [Op.ne]: id }
				}
			})
			if(username) res.send("Username already registered")				
			const email = await User.findOne({ 
				where: {
					email: req.body.email,
					id: { [Op.ne]: id }
				}
			})
			if(email) res.send("Email already registered")
			
			if(req.file){					
				if(req.file.filename) {
					req.body['image'] = await addImage(req.file.filename)
					if(user.image) deleteImage(user.image)
				}
			}

			await user.update(req.body)
			res.send(user)			
		} catch (err){
			res.status(500).send({ error: err})
		}
	},

	async delete (req,res,next){
		try {
			const user = await User.findByPk(req.params.userId)
			if (!user) { 
				res.status(404).send({ error: 'User not found'})
			} else {
				await user.destroy()
				await deleteImage(user.image)
				res.send(user)
			}
		} catch(err) {
			res.status(500).send({ error: err})
		}
	},

	login (req, res, next){
		const user = req.user //passport object
		const token = Auth.jwtSignUser({uid: user.id, email: user.email })				
		res.send({ id: user.id, name: user.name, username: user.username, email:user.email, image: user.image, token} )
	},

	secret (req, res, next){
		res.send('Secret Page')
	},	
}

function deleteImage(item){
	let originalImage = './' + config.storage.users + '/' + item
	let thumbImage = './' + config.storage.users + '/thumb/' + item
	if (fs.existsSync(originalImage)) { fs.unlink(originalImage, (err)=>{ console.log(err)}) }
	if (fs.existsSync(thumbImage)) { fs.unlink(thumbImage, (err)=>{ console.log(err) })	}		
	return item
} 