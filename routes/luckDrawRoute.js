// routes/participant.routes.js
const express = require('express');
const { luckyDraw } = require('../models');
const router = express.Router();

// 创建参与者
// POST /participants
// body: { name, weight }
router.post('/', async (req, res) => {
  try {
    const { name, weight = 1 } = req.body;
    const participant = await luckyDraw.create({ name, weight });
    res.status(201).json({ message: 'Participant created successfully!', participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// 获取参与者列表（支持分页、排序）
// GET /participants?page=1&pageSize=10&sortBy=weight&order=DESC
router.get('/', async (req, res) => {
  try {
    let { page = 1, pageSize = 10, sortBy = 'id', order = 'ASC' } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const offset = (page - 1) * pageSize;

    // 防注入校验
    const validSortBy = ['id', 'weight', 'created_at'];
    const validOrder = ['ASC', 'DESC'];
    if (!validSortBy.includes(sortBy) || !validOrder.includes(order.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid sortBy or order parameter' });
    }

    const participants = await luckyDraw.findAll({
      order: [[sortBy, order.toUpperCase()]],
      limit: pageSize,
      offset
    });

    res.json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// 获取单个参与者
// GET /participants/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await luckyDraw.findByPk(id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json({ participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
});

// 更新参与者
// PUT /participants/:id
// body: { name?, weight? }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [affected] = await luckyDraw.update(updates, { where: { id } });
    if (affected === 0) {
      return res.status(404).json({ error: 'Participant not found or no changes' });
    }
    const participant = await luckyDraw.findByPk(id);
    res.json({ message: 'Participant updated successfully!', participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update participant' });
  }
});

// 删除参与者
// DELETE /participants/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rowsDeleted = await luckyDraw.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json({ message: 'Participant deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

// 删除全部参与者
// DELETE /participants
router.delete('/', async (req, res) => {
    try {
      const rowsDeleted = await luckyDraw.destroy({ where: {}, truncate: false });
      // 如果想重置自增主键，可改为 truncate: true
      res.json({ message: `Deleted ${rowsDeleted} participants successfully!` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete all participants' });
    }
  });
  

module.exports = router;
