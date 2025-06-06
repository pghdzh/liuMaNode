const express = require("express");
const sequelize = require("./config/db");
const imageUploadsRouter = require("./routes/imageUploads");
const liumaMediaRoutes = require('./routes/liumaMedia');
const aiImagesRoutes = require('./routes/aiImages')
const luckyDrawRoutes = require('./routes/luckDrawRoute')
const YeQiMessageRoutes = require('./routes/YeQiMessageRoute')
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const path = require("path");
// 中间件
app.use(express.json()); // 解析 JSON 请求体
// 使用 cors 中间件，允许跨域请求
app.use(cors());
// 静态文件托管
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 路由
app.use("/api/images", imageUploadsRouter);
app.use('/api/liuma-media', liumaMediaRoutes);
app.use('/api/aiImages', aiImagesRoutes)
app.use('/api/luckyDraw', luckyDrawRoutes)
app.use('/api/YeQiMessage', YeQiMessageRoutes)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });
// 数据库连接和服务器启动
sequelize
    .sync({ force: false }) // 确保数据库表已同步
    .then(() => {
        app.listen(PORT, () => {
            console.log(`服务器已启动，端口：${PORT}`);
        });
    })
    .catch((error) => {
        console.error("数据库连接失败", error);
    });
