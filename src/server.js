const express = require('express');
const repo = require('./repos/repo.memory');

const app = express();
app.use(express.json());

// Serve frontend static files
app.use(express.static('frontend'));

// Helpers
function parseMatchFromQuery(q) {
  const m = {};
  ['massa','recheio','cobertura','peso','decoracaoExtra','id'].forEach(k => {
    if (q[k] !== undefined) {
      if (k === 'peso') m[k] = Number(q[k]);
      else if (k === 'decoracaoExtra') m[k] = q[k] === 'true' || q[k] === '1';
      else m[k] = q[k];
    }
  });
  return m;
}

// POST /items - create
app.post('/items', (req, res) => {
  try {
    const data = req.body;
    const created = repo.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /items - list all
app.get('/items', (req, res) => {
  const all = repo.list();
  res.json(all);
});

// GET /items/find?... - find by query (returns first match)
app.get('/items/find', (req, res) => {
  const match = parseMatchFromQuery(req.query);
  const found = repo.get(match);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.json(found);
});

// PUT /items - body: { match: {...}, patch: {...} }
app.put('/items', (req, res) => {
  const { match, patch } = req.body || {};
  if (!match || !patch) return res.status(400).json({ error: 'match and patch required' });
  const updated = repo.update(match, patch);
  if (!updated) return res.status(404).json({ error: 'Not found or invalid patch' });
  res.json(updated);
});

// DELETE /items - body: { match: {...} }
app.delete('/items', (req, res) => {
  const { match } = req.body || {};
  if (!match) return res.status(400).json({ error: 'match required' });
  const ok = repo.del(match);
  if (!ok) return res.status(404).json({ error: 'No items removed' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;

// Only listen if this is the main module (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

module.exports = app;

