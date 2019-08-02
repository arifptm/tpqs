const Joi = require('@hapi/joi')

module.exports = {
	create (req, res, next) {
		const schema = Joi.object().keys({			
		// 	fullname: Joi.string().min(6).regex(/^[\w\-\s]+$/).strip().required(),
		// 	alias: Joi.string().min(4).regex(/^[\w\-\s]+$/).strip().required(),
		// 	address: Joi.string().required(),
		// 	enabled: Joi.boolean().required()
		}).options({ allowUnknown: true })

		const {error, value} = Joi.validate(req.body, schema)
		error ? res.status(400).send(error.details[0].message) : next()			
	},

	update (req, res, next) {	
		const schema = Joi.object().keys({			
			debt_id: Joi.number().integer(),
			event_id: Joi.number().integer(),
			billed_on: Joi.string().required(),
			amount: Joi.number().required(),
			note: Joi.string()
		})
		
		const {error, value} = Joi.validate(req.body, schema)		
		error ? res.status(400).send(error.details[0].message) : next()
	}

}

