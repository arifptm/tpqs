module.exports = (sequelize, DataTypes) => {
	const Saving = sequelize.define('Saving', {
		member_id: { type: DataTypes.INTEGER, allowNull: false },
		event_id: { type: DataTypes.INTEGER, allowNull: false },
		amount: { type: DataTypes.DECIMAL, defaultValue: 0},		
		note: { type: DataTypes.STRING}
	}, {
		timestamps: false
	})

	Saving.associate = function (models) {
    Saving.belongsTo(models.Member, {foreignKey : 'member_id'})
    Saving.belongsTo(models.Event, {foreignKey : 'event_id'})
  }

	return Saving
}
