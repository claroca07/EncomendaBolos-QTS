const repo = require('../src/repos/repo.memory');

beforeEach(() => {
  repo._reset();
});

test('list começa vazio', () => {
  expect(repo.list()).toEqual([]);
});

test('create retorna dados tratados e persiste', () => {
  const data = {
    massa: '   baunilha   ',
    recheio: ' brigadeiro ',
    cobertura: ' chocolate ',
    peso: '2',
    decoracaoExtra: true,
    fotoDecoracao: 'http://exemplo.com/foto.jpg'
  };
  const created = repo.create(data);
  expect(created.id).toBeDefined();
  expect(created.massa).toBe('baunilha');
  expect(created.recheio).toBe('brigadeiro');
  expect(created.cobertura).toBe('chocolate');
  expect(created.peso).toBe(2);
  expect(created.decoracaoExtra).toBe(true);
  expect(created.fotoDecoracao).toBe('http://exemplo.com/foto.jpg');
  expect(repo.list().length).toBe(1);
});

test('get retorna cópia ou null se não encontrar', () => {
  const a = repo.create({ massa: 'A', recheio: 'R', cobertura: 'C', peso: 1 });
  const found = repo.get({ id: a.id });
  expect(found).not.toBe(a);
  expect(found.id).toBe(a.id);
  expect(repo.get({ id: '999' })).toBeNull();
});

test('update atualiza apenas a primeira ocorrência', () => {
  repo.create({ massa: 'A', recheio: 'R1', cobertura: 'C', peso: 1 });
  repo.create({ massa: 'A', recheio: 'R2', cobertura: 'C', peso: 1 });
  const updated = repo.update({ massa: 'A' }, { recheio: 'R-atualizado' });
  expect(updated.recheio).toBe('R-atualizado');
  const all = repo.list();
  expect(all.filter(x => x.recheio === 'R-atualizado').length).toBe(1);
});

test('del remove todas as ocorrências que casam e retorna true/false', () => {
  repo.create({ massa: 'X', recheio: 'r', cobertura: 'c', peso: 1 });
  repo.create({ massa: 'X', recheio: 'r', cobertura: 'c', peso: 1 });
  const ok = repo.del({ massa: 'X' });
  expect(ok).toBe(true);
  expect(repo.list().length).toBe(0);
  const notFound = repo.del({ massa: 'não existe' });
  expect(notFound).toBe(false);
});
