const { DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 引入数据库配置

const luckyDraw = sequelize.define('luckyDraw', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '参与者ID'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '参与者姓名'
    },
    weight: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '权重'
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    }
  }, {
    tableName: 'lucky_draw',
    underscored: true,
    timestamps: false
  });
  

module.exports = luckyDraw;
