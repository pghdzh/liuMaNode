const express = require('express');
const multer = require('multer');
const path = require('path');
const { AIGeneratedImage } = require('../models'); // 导入 Image 模型
const router = express.Router();
// 配置 multer 存储到 uploads/aiImg
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/aiImg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 确保文件名唯一
  },
});

const upload = multer({ storage });

// 上传图片接口
router.post("/upload-ai-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "请上传图片" });
  }
  const imagePath = `/uploads/aiImg/${req.file.filename}`;
  res.json({ message: "图片上传成功", imagePath });
});



/** ✅ 1. 创建 AI 生成的图片记录 */
router.post("/", async (req, res) => {
  try {
    const { image_name, image_path, description, orientation } = req.body;

    if (!image_name || !image_path) {
      return res.status(400).json({ error: "图片名称和路径不能为空" });
    }

    const newImage = await AIGeneratedImage.create({
      image_name,
      image_path,
      description,
      orientation
    });

    res.status(201).json({ message: "图片记录创建成功", data: newImage, code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "创建失败" });
  }
});

/** ✅ 2. 获取所有 AI 生成的图片 */
router.get("/", async (req, res) => {
  try {
    const { sortBy = 'updated_at', order = 'DESC', page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    const validSortBy = ['updated_at', 'likes']; // 允许的排序字段
    const validOrder = ['ASC', 'DESC']; // 允许的排序方向

    if (!validSortBy.includes(sortBy) || !validOrder.includes(order.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid sortBy or order parameter' });
    }
    const { count, rows } = await AIGeneratedImage.findAndCountAll({
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(pageSize),
      offset: offset
    });


    res.json({ data: rows, code: 200, total: count, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "获取失败" });
  }
});

/** ✅ 3. 更新图片信息 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image_name, description, orientation } = req.body;

    const image = await AIGeneratedImage.findByPk(id);
    if (!image) return res.status(404).json({ error: "图片不存在" });

    image.image_name = image_name || image.image_name;
    image.description = description || image.description;
    image.orientation = orientation || image.orientation
    await image.save();

    res.json({ message: "更新成功", data: image, code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "更新失败" });
  }
});

/** ✅ 4. 删除单个图片记录 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const image = await AIGeneratedImage.findByPk(id);
    if (!image) return res.status(404).json({ error: "图片不存在" });

    await image.destroy();
    res.json({ message: "删除成功", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "删除失败" });
  }
});

/** ✅ 5. 删除所有图片 */
router.delete("/", async (req, res) => {
  try {
    await AIGeneratedImage.destroy({ where: {} });
    res.json({ message: "所有 AI 生成的图片已删除", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "删除失败" });
  }
});

/** ✅6.点赞 */
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const image = await AIGeneratedImage.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    image.likes += 1;
    await image.save();

    res.json({ message: 'Image liked successfully!', image, code: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like image' });
  }
});

module.exports = router;