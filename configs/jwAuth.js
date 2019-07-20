const jwt = require('jsonwebtoken')
const config = require('../configs/config') 

module.exports = {
	isAuthenticated(req, res, next){
	  var token = req.body.token || req.query.token || req.headers.authorization; // mengambil token di antara request
	  if(token){ //jika ada token
	    jwt.verify(token, config.jwtSecret, function(err, decoded){ //jwt melakukan verify
	      if (err) { // apa bila ada error
	        res.json({message: 'Failed to authenticate token'}); // jwt melakukan respon
	      }else { // apa bila tidak error
	      	// console.log(decoded)
	        req.authUser = decoded; // menyimpan decoded ke req.decoded	       
	        next(); //melajutkan proses
	      }
	    });
	  }else { // apa bila tidak ada token
	    return res.status(403).send({message: 'No token provided.'}); // melkukan respon kalau token tidak ada
	  }
	},

	jwtSignUser (user){
		const ONE_MONTH = 30 * 60 * 60 * 24 * 7
		return jwt.sign(user, config.jwtSecret,{
			expiresIn: ONE_MONTH
		})
	}

}