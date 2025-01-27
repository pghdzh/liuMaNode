const express = require('express');
const multer = require('multer');
const { Image } = require('../models'); // 导入 Image 模型
const router = express.Router();

// 配置 Multer 文件存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 上传图片
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;
        const filePath = req.file.path;

        const image = await Image.create({
            file_path: filePath,
            description: description || null
        });

        res.status(201).json({ message: 'Image uploaded successfully!', image });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// 获取图片列表
router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'upload_time', order = 'DESC' } = req.query;
        const offset = (page - 1) * pageSize;
        console.log('req.query;',req.query);
        // 验证排序字段是否合法，防止 SQL 注入
        const validSortBy = ['upload_time', 'likes']; // 允许的排序字段
        const validOrder = ['ASC', 'DESC']; // 允许的排序方向

        if (!validSortBy.includes(sortBy) || !validOrder.includes(order.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid sortBy or order parameter' });
        }

        const images = await Image.findAll({
            order: [[sortBy, order.toUpperCase()]], // 动态设置排序字段和方向
            limit: parseInt(pageSize),
            offset: offset
        });

        res.json({ images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});


// 点赞图片
router.post('/:id/like', async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Image.findByPk(id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        image.likes += 1;
        await image.save();

        res.json({ message: 'Image liked successfully!', image });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to like image' });
    }
});

// 删除图片
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const rowsDeleted = await Image.destroy({
            where: { id }
        });

        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ message: 'Image deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
