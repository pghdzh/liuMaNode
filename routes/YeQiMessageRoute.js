// routes/messages.js
const express = require('express');
const router = express.Router();
const { YeQiMessage } = require('../models'); // Sequelize 模型

/**
 * GET /api/messages
 * 查询留言列表，支持分页
 * Query Params:
 *   - page (默认 1)
 *   - pageSize (默认 10)
 */
router.get('/', async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const pageSize = Math.max(parseInt(req.query.pageSize) || 10, 1);
        const offset = (page - 1) * pageSize;

        const { count, rows } = await YeQiMessage.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit: pageSize,
            offset,
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                pageSize,
                totalPages: Math.ceil(count / pageSize),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '获取留言列表失败' });
    }
});

/**
 * GET /api/messages/:id
 * 根据 ID 查询单条留言
 */
router.get('/:id', async (req, res) => {
    try {
        const message = await YeQiMessage.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: '留言未找到' });
        }
        res.json({ success: true, data: message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '查询留言失败' });
    }
});

/**
 * POST /api/messages
 * 新增一条留言
 * Body:
 *   - name    留言者姓名（必填）
 *   - content 留言内容（必填）
 */
router.post('/', async (req, res) => {
    try {
        const { name, content } = req.body;
        if (!name || !content) {
            return res
                .status(400)
                .json({ success: false, message: 'name 和 content 为必填项' });
        }
        const message = await YeQiMessage.create({ name, content });
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '创建留言失败' });
    }
});

/**
 * PUT /api/messages/:id
 * 更新一条留言（仅 content 可改）
 * Body:
 *   - content 留言内容（必填）
 */
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res
                .status(400)
                .json({ success: false, message: 'content 为必填项' });
        }
        const [count] = await YeQiMessage.update(
            { content },
            { where: { id: req.params.id } }
        );
        if (count === 0) {
            return res.status(404).json({ success: false, message: '留言未找到' });
        }
        const updated = await YeQiMessage.findByPk(req.params.id);
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '更新留言失败' });
    }
});

/**
 * DELETE /api/messages/:id
 * 删除一条留言
 */
router.delete('/:id', async (req, res) => {
    try {
        const count = await YeQiMessage.destroy({ where: { id: req.params.id } });
        if (count === 0) {
            return res.status(404).json({ success: false, message: '留言未找到' });
        }
        res.json({ success: true, message: '删除成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '删除留言失败' });
    }
});

module.exports = router;
