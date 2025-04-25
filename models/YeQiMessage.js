const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // 引入数据库配置

const YeQiMessage = sequelize.define(
  'YeQiMessage',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '留言ID',
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '留言者姓名',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '留言内容',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '留言时间',
    },
  },
  {
    tableName: 'messages',
    timestamps: false, // 禁用 Sequelize 自动添加的 createdAt 和 updatedAt 字段
    indexes: [
      {
        name: 'idx_created_at',
        fields: ['created_at'],
      },
    ],
  }
);

module.exports = YeQiMessage;
