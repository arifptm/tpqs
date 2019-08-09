module.exports = (sequelize, DataTypes) => {
	const Event = sequelize.define('Event', {
		member_id: { type: DataTypes.INTEGER, allowNull: false },
		date: { type: DataTypes.DATEONLY, allowNull: false },
		note: { type: DataTypes.STRING},
		debt: { type: DataTypes.DECIMAL, defaulValue: 0},
		saving: { type: DataTypes.DECIMAL, defaulValue: 0},
		installment: { type: DataTypes.DECIMAL, defaulValue: 0},
		other: { type: DataTypes.DECIMAL, defaulValue: 0},
		last_balance: { type: DataTypes.DECIMAL, defaulValue: 0},
		balance: { type: DataTypes.DECIMAL, defaulValue: 0},
		cash: { type: DataTypes.DECIMAL, defaulValue: 0}
	}, {
		timestamps: false
	})

	Event.associate = function (models) {
    Event.belongsTo(models.Member, {foreignKey : 'member_id'})
    Event.hasMany(models.Debt, {foreignKey : 'event_id'})
    Event.hasMany(models.Saving, {foreignKey : 'event_id'})    
    Event.hasMany(models.Installment, {foreignKey : 'event_id'})
  }

	return Event
}
