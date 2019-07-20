module.exports = (sequelize, DataTypes) => {
	const Installment = sequelize.define('Installment', {
		debt_id: { type: DataTypes.INTEGER, allowNull: false },
		meeting_id: { type: DataTypes.INTEGER, allowNull: false },
		amount: { type: DataTypes.DECIMAL, defaultValue: 0},		
		has_paid: { type: DataTypes.BOOLEAN, defaultValue: false},
		note: { type: DataTypes.STRING}
	}, {
		timestamps: false
	})

	Installment.associate = function (models) {
    Installment.belongsTo(models.Debt, {foreignKey : 'debt_id'})
  }

	return Installment
}
