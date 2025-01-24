const { Sequelize } = require("sequelize");

// 创建 Sequelize 实例，连接到数据库
const sequelize = new Sequelize("image_upload_system", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,        // 默认 MySQL 端口
});
try {
  sequelize.authenticate();
  console.log("数据库连接成功");
} catch (error) {
  console.error("无法连接到数据库:", error);
}

module.exports = sequelize;
