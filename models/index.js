// models/index.js

const sequelize = require("../config/db");
const Image = require("./Images");
const LiumaMedia = require('./liumaMedia')
const AIGeneratedImage = require('./AIGeneratedImage')
const luckyDraw = require("./luckyDraw")
// 导出所有模型
module.exports = {
  sequelize,
  Image,
  LiumaMedia,
  AIGeneratedImage,
  luckyDraw,
};
