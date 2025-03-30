import { DataTypes } from 'sequelize';

const userModel = (sequelize) => {
  return sequelize.define('User', {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
      }
  }, {
    tableName: 'users',  // This model will be saved in a table called 'users'
    timestamps: true,   // Sequelize will automatically manage createdAt and updatedAt columns
    createdAt: 'created_at',
    updatedAt: 'updated_at'    // Disable updatedAt column
  });
};

export default userModel;