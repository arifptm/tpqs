const Joi = require('@hapi/joi')

module.exports = {
	register (req, res, next) {		
		const schema = Joi.object().keys({			
			fullname: Joi.string().min(6).regex(/^[\w\-\s]+$/).strip().required(),
			username: Joi.string().min(4).alphanum().required(),
			email: Joi.string().email().required(),
			password: Joi.string().strip().required(),
			password2: Joi.string().valid(Joi.ref('password')).required(),
		}).options({ allowUnknown: true })

		const {error, value} = Joi.validate(req.body, schema)
		error ? res.status(400).send(error.details[0].message) : next()			
	},

	update (req, res, next) {		
		const schema = Joi.object().keys({			
			fullname: Joi.string().min(6).regex(/^[\w\-\s]+$/).strip().required(),
			username: Joi.string().min(4).alphanum().required(),
			email: Joi.string().email().required(),			
			password: Joi.string().strip().optional(),
			password2: Joi.string().valid(Joi.ref('password')).optional()			
		}).options({ allowUnknown: true })

		const {error, value} = Joi.validate(req.body, schema)		
		error ? res.status(400).send(error.details[0].message) : next()			
	}

}
