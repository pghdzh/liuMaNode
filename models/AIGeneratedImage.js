const { DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 引入数据库配置

const AIGeneratedImage = sequelize.define(
  "AIGeneratedImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "图片名称",
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "图片存储路径",
    },
    description: {
      type: DataTypes.TEXT,
      comment: "图片描述",
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "点赞量",
    },
    orientation: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 2, // 默认横向
      comment: "方向（1: 竖向, 2: 横向）"
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    }
  },
  {
    tableName: "ai_generated_images",
    timestamps: true, // 启用 Sequelize 自动管理 created_at 和 updated_at
    createdAt: 'created_at',  // 显式指定数据库中的字段名
    updatedAt: 'updated_at'   // 显式指定数据库中的字段名
  }
);

module.exports = AIGeneratedImage;
