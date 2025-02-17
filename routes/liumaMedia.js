const express = require('express');
const multer = require('multer');
const path = require('path');
const { LiumaMedia } = require('../models'); // 导入 Image 模型
const router = express.Router();
const fs = require('fs').promises; // 使用 fs.promises 来避免回调地狱

// 设置 Multer 存储位置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/liumaImg'); // 上传路径
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
        cb(null, fileName);
    }
});

// 过滤文件类型（仅允许图片）
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('仅支持 JPG、PNG 和 GIF 图片！'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 限制 10MB
});


// 上传图片接口
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `/uploads/liumaImg/${req.file.filename}`;
    res.json({ image_url: imageUrl });
});

// 添加流麻记录
router.post("/", async (req, res) => {
    try {
        const { title, orientation, image_url, video_url } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: "Image URL is required" });
        }

        const newRecord = await LiumaMedia.create({
            title,
            orientation,
            image_url,
            video_url,
        });

        res.json({ message: "流麻记录添加成功", data: newRecord, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "添加失败" });
    }
});

// 📌 获取所有流麻图片 API
router.get('/', async (req, res) => {
    try {
        const { sortBy = 'created_at', order = 'DESC', page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const { count, rows } = await LiumaMedia.findAndCountAll({
            order: [[sortBy, order.toUpperCase()]],
            limit: parseInt(pageSize),
            offset: offset
        });

        res.json({ total: count, media: rows, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '获取图片失败' });
    }
});

// 📌 根据 ID 获取单个图片 API
router.get('/:id', async (req, res) => {
    try {
        const media = await LiumaMedia.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: '图片未找到' });
        }
        res.json(media);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '获取图片失败' });
    }
});

// 📌 更新流麻图片信息 API
router.put('/:id', async (req, res) => {
    try {
        const { title, orientation, video_url } = req.body;
        const media = await LiumaMedia.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: '图片未找到' });
        }

        await media.update({
            title: title || media.title,
            orientation: orientation ? parseInt(orientation) : media.orientation,
            video_url: video_url || media.video_url
        });

        res.json({ message: '图片信息更新成功！', media, code: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '更新图片信息失败' });
    }
});


// 📌 删除流麻图片 API
router.delete('/:id', async (req, res) => {
    try {
        const media = await LiumaMedia.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: '图片未找到' });
        }

        // 获取图片文件的路径
        const imagePath = path.join("uploads", "liumaImg", path.basename(media.image_url));

        // 删除文件
        try {
            await fs.unlink(imagePath); // 使用 fs.promises.unlink 来简化删除操作
        } catch (err) {
            console.error("删除图片文件失败", err);
            return res.status(500).json({ error: "删除图片文件失败" });
        }

        // 删除数据库记录
        try {
            await media.destroy(); // 删除数据库记录
            res.json({ message: "删除成功", code: 200 });
        } catch (dbError) {
            console.error("删除数据库记录失败", dbError);
            res.status(500).json({ error: "删除数据库记录失败" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '删除图片失败' });
    }
});

// 📌 删除全部流麻图片 API
router.delete("/deleteAll", async (req, res) => {
    try {
        // 获取所有图片记录
        const images = await LiumaMedia.findAll();

        // 删除所有图片的文件
        const deleteFilesPromises = images.map((image) => {
            const imagePath = path.join("uploads", "liumaImg", path.basename(image.image_url));
            return fs.unlink(imagePath); // 使用 fs.promises.unlink 来删除文件
        });

        // 等待所有文件删除完成
        await Promise.all(deleteFilesPromises);

        // 删除所有数据库记录
        await LiumaMedia.destroy({ where: {} }); // 清空表
        res.json({ message: "所有流麻数据已删除！", code: 200 });
    } catch (error) {
        console.error("删除流麻数据失败:", error);
        res.status(500).json({ error: "删除失败" });
    }
});

module.exports = router;
