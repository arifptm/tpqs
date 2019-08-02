module.exports = (sequelize, DataTypes) => {
	const Debt = sequelize.define('Debt', {
		member_id: { type: DataTypes.INTEGER, allowNull: false },
		event_id: { type: DataTypes.INTEGER, allowNull: false },
		amount: { type: DataTypes.DECIMAL, defaultValue: 0},		
		paid: { type: DataTypes.DECIMAL, defaultValue: 0},
		paytimes: { type: DataTypes.INTEGER, defaultValue: 10},
		note: { type: DataTypes.STRING}
	}, {
		timestamps: false
	})

	Debt.associate = function (models) {
    Debt.belongsTo(models.Member, {foreignKey : 'member_id'})
    Debt.belongsTo(models.Event, {foreignKey : 'event_id'})
    Debt.hasMany(models.Installment, {foreignKey : 'debt_id'})
    Debt.hasMany(models.Inout, {foreignKey : 'debt_id'})
  }

	return Debt
}
