const fs = require('fs-extra');
const multer  = require('multer');
require('../configs/passport.js');
const config = require('../configs/config');
const sharp = require('sharp');

const tmp = './' + config.storage.tmp
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)	

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, tmp)
	},
	filename: function(req, file, cb){
		cb(null, file.originalname )
	}
})

const upload = multer({ storage })

async function addImage(filename, dest, userId){
	var dir = (userId) ? './' + dest + '/' + userId : dir = './' + dest
	if (!fs.existsSync(dir)) fs.mkdirSync(dir)
	const dirThumb = dir + '/thumb'
	if (!fs.existsSync(dirThumb)) fs.mkdirSync(dirThumb)

	const input = sharp('./' + tmp + '/' + filename)
	await input.clone().resize(1920, 1080).toFile( dir +'/'+ filename, function(err){
		if(err) console.log(err)
		input.clone().resize(480, 270).toFile( dirThumb +'/'+ filename, function(err){
			if(err) console.log(err)
			fs.unlink( tmp + '/' + filename, function(err){
				if(err) console.log(err)				
			})
		})		
	})
	return filename
}	

async function addVideo(filename, dest, userId){
	const dir = './' + dest + '/' + userId
	if (!fs.existsSync(dir)) fs.mkdirSync(dir)
	await fs.rename( tmp + '/' + filename, dir +'/'+ filename)
	return filename	
}	

module.exports = { upload, addImage, addVideo }
