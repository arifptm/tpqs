module.exports = (sequelize, DataTypes) => {
	const Inout = sequelize.define('Inout', {		
		debt_id: { type: DataTypes.INTEGER},
		member_id: { type: DataTypes.INTEGER, allowNull: false },
		event_id: { type: DataTypes.INTEGER, allowNull: false },
		note: { type: DataTypes.STRING},
		amount: { type: DataTypes.DECIMAL, defaultValue: 0}
	}, {
		timestamps: false
	})

	Inout.associate = function (models) {
    Inout.belongsTo(models.Debt, {foreignKey : 'debt_id'})
    Inout.belongsTo(models.Member, {foreignKey : 'member_id'})
    Inout.belongsTo(models.Event, {foreignKey : 'event_id'})
  }

	return Inout
}