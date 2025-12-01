// Repositório em memória para "Encomenda de Bolo"
// Modelo de registro (obj):
// {
//   id,
//   massa,          // string
//   recheio,        // string
//   cobertura,      // string
//   peso,           // number (kg)
//   decoracaoExtra, // boolean
//   fotoDecoracao   // string|null (url/base64) opcional
// }

let store = [];
let nextId = 1;

function _reset() {
  store = [];
  nextId = 1;
}

function _clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _matches(item, match) {
  if (!match || Object.keys(match).length === 0) return true;
  return Object.keys(match).every(k => {
    if (!(k in item)) return false;
    return item[k] === match[k];
  });
}

function list() {
  return _clone(store);
}

function get(match) {
  const found = store.find(item => _matches(item, match));
  return found ? _clone(found) : null;
}

function _normalize(data) {
  const out = {};
  if (data.massa !== undefined) out.massa = String(data.massa).trim();
  if (data.recheio !== undefined) out.recheio = String(data.recheio).trim();
  if (data.cobertura !== undefined) out.cobertura = String(data.cobertura).trim();
  if (data.peso !== undefined) out.peso = Number(data.peso);
  if (data.decoracaoExtra !== undefined) out.decoracaoExtra = Boolean(data.decoracaoExtra);
  if (data.fotoDecoracao !== undefined) out.fotoDecoracao = data.fotoDecoracao || null;
  return out;
}

function create(data) {
  if (!data || typeof data !== 'object') throw new Error('Dados inválidos');
  const normalized = _normalize(data);
  const item = Object.assign({ id: String(nextId++) }, normalized);
  store.push(item);
  return _clone(item);
}

function update(match, patch) {
  if (!patch || typeof patch !== 'object' || Object.keys(patch).length === 0) return null;
  const idx = store.findIndex(item => _matches(item, match));
  if (idx === -1) return null;
  const normalized = _normalize(patch);
  store[idx] = Object.assign({}, store[idx], normalized);
  return _clone(store[idx]);
}

function del(match) {
  const originalLen = store.length;
  store = store.filter(item => !_matches(item, match));
  const removed = originalLen - store.length;
  return removed > 0;
}

module.exports = {
  list,
  get,
  create,
  update,
  del,
  _reset
};
