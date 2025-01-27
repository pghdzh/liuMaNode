const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db"); // 引入数据库配置

// 定义图片模型
const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  upload_time: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('待打印', '待做'),
    defaultValue: '待打印'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'images',
  timestamps: false
});



module.exports = Image
