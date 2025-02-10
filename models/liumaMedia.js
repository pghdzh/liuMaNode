const { DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 引入数据库配置

const LiumaMedia = sequelize.define('LiumaMedia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: '主键ID'
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '流麻图片URL'
    },
    orientation: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '图片方向（1=竖，2=横）'
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '图片标题'
    },
    video_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '流麻视频URL'
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
}, {
    tableName: 'liuma_media',
    timestamps: true, // Sequelize 自动管理 created_at 和 updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = LiumaMedia;
