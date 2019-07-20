const bcrypt = require('bcryptjs')

function hashPassword (user, options) {
	const SALT_FACTOR = 8	
	if (!user.changed('password')){ return }

	const salt = bcrypt.genSaltSync(10);

	const hashed = bcrypt.hashSync(user.password, salt);

	return hashed
} 

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		fullname: { type: DataTypes.STRING, allowNull: false },
		username: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		password: { type: DataTypes.STRING, allowNull: false },
		image: { type: DataTypes.STRING },
		active: { type: DataTypes.BOOLEAN, defaultValue: true },
		role: { type: DataTypes.STRING, defaultValue: 'user' }
	}, {
		timestamps: false,
		hooks: {
			beforeCreate: hashPassword,
			beforeUpdate: hashPassword
		}

	})

	User.prototype.comparePassword = function (password){
		return bcrypt.compareAsync(password, this.password)
	}

	return User
}
