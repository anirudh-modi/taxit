'use strict';
module.exports = (sequelize, DataTypes) => {
    var Trips = sequelize.define('Trips',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // attributes
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            driver_id: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.ENUM('WAITING', 'ONGOING', 'COMPLETED'),
                defaultValue: 'WAITING'
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            picked_at: {
                type: DataTypes.DATE
            },
            completed_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'trips',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );

    return Trips;
};
