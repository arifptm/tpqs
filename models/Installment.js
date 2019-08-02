module.exports = (sequelize, DataTypes) => {
	const Installment = sequelize.define('Installment', {
		debt_id: { type: DataTypes.INTEGER, allowNull: false },		
		event_id: { type: DataTypes.INTEGER},	
		billed_on:	{ type: DataTypes.DATEONLY, allowNull: false },	
		amount: { type: DataTypes.DECIMAL, defaultValue: 0},		
		note: { type: DataTypes.STRING}
	}, {
		timestamps: false
	})

	Installment.associate = function (models) {
    Installment.belongsTo(models.Debt, {foreignKey : 'debt_id'})    
    Installment.belongsTo(models.Event, {foreignKey : 'event_id'})  
  }

	return Installment
}
