// models/index.js

const sequelize = require("../config/db");
const Image = require("./Images");

// 导出所有模型
module.exports = {
  sequelize,
  Image,
};
