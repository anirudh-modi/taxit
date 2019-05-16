'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/
		return queryInterface
			.createTable("trips", {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				// attributes
				customer_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				driver_id: {
					type: Sequelize.INTEGER
				},
				status: {
					type: Sequelize.ENUM('WAITING', 'ONGOING', 'COMPLETED'),
					defaultValue: 'WAITING'
				},
				created_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW
				},
				picked_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.NOW
				}
			})
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.dropTable('users');
		*/
		return queryInterface.dropTable('trips');

	}
};
