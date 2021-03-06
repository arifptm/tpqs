 module.exports = (sequelize, DataTypes) => {
	const Member = sequelize.define('Member', {
		fullname: { type: DataTypes.STRING, allowNull: false },
		alias: { type: DataTypes.STRING, allowNull: false },
		address: { type: DataTypes.STRING },
		phone: { type: DataTypes.STRING },
		image: { type: DataTypes.STRING },
		enabled: { type: DataTypes.BOOLEAN, defaultValue: true }		
	}, {
		timestamps: false
	})

	Member.associate = function (models) {
    Member.hasMany(models.Saving, {foreignKey : 'member_id'})
    Member.hasMany(models.Debt, {foreignKey : 'member_id'})
    Member.hasMany(models.Event, {foreignKey : 'member_id'})
    Member.hasMany(models.Inout, {foreignKey : 'member_id'})
  }

	return Member
}
