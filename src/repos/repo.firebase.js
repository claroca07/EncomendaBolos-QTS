const admin = require('firebase-admin');

let db;
const COLLECTION = 'encomendas';

function _init() {
  if (!db) {
    // Initialize admin SDK. It will use GOOGLE_APPLICATION_CREDENTIALS env var
    // or application default credentials. For emulator, set FIRESTORE_EMULATOR_HOST.
    try {
      admin.initializeApp();
    } catch (e) {
      // initializeApp can be called multiple times in tests; ignore if already initialized
    }
    db = admin.firestore();
  }
}

function _clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _matches(obj, match) {
  if (!match || Object.keys(match).length === 0) return true;
  return Object.keys(match).every(k => obj[k] === match[k]);
}

async function list() {
  _init();
  const snapshot = await db.collection(COLLECTION).get();
  const out = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    data.id = doc.id;
    out.push(data);
  });
  return _clone(out);
}

async function get(match) {
  _init();
  const docs = await _queryMatch(match);
  if (docs.length === 0) return null;
  const d = docs[0].data();
  d.id = docs[0].id;
  return _clone(d);
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

async function create(data) {
  _init();
  if (!data || typeof data !== 'object') throw new Error('Dados inválidos');
  const normalized = _normalize(data);
  const ref = await db.collection(COLLECTION).add(normalized);
  const snap = await ref.get();
  const out = snap.data();
  out.id = ref.id;
  return _clone(out);
}

async function update(match, patch) {
  _init();
  if (!patch || typeof patch !== 'object' || Object.keys(patch).length === 0) return null;
  const docs = await _queryMatch(match);
  if (docs.length === 0) return null;
  const id = docs[0].id;
  const normalized = _normalize(patch);
  await db.collection(COLLECTION).doc(id).update(normalized);
  const snap = await db.collection(COLLECTION).doc(id).get();
  const out = snap.data();
  out.id = id;
  return _clone(out);
}

async function del(match) {
  _init();
  const docs = await _queryMatch(match);
  if (docs.length === 0) return false;
  const batch = db.batch();
  docs.forEach(d => batch.delete(db.collection(COLLECTION).doc(d.id)));
  await batch.commit();
  return true;
}

async function _queryMatch(match) {
  _init();
  if (!match || Object.keys(match).length === 0) {
    const snap = await db.collection(COLLECTION).get();
    const arr = [];
    snap.forEach(doc => { arr.push({ id: doc.id, data: doc.data() }); });
    return arr;
  }
  // Build Firestore query chaining where() for each field in match
  let q = db.collection(COLLECTION);
  Object.keys(match).forEach(k => {
    q = q.where(k, '==', match[k]);
  });
  const snap = await q.get();
  const arr = [];
  snap.forEach(doc => { arr.push({ id: doc.id, data: doc.data() }); });
  return arr;
}

async function _reset() {
  _init();
  // Delete all docs in collection (careful! for tests only)
  const snap = await db.collection(COLLECTION).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.forEach(doc => batch.delete(db.collection(COLLECTION).doc(doc.id)));
  await batch.commit();
}

module.exports = {
  list,
  get,
  create,
  update,
  del,
  _reset
};
