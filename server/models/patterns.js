import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

// Create schema that represents Patterns table in db
export const Patterns = sequelize.define('pattern', {
    pattern_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pattern_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pattern_info: {
        type: DataTypes.JSON,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'Patterns',
    timestamps: false
});


