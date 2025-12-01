document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-encomenda');
  const msg = document.getElementById('msg');
  const decoracaoExtraCheckbox = document.getElementById('decoracaoExtra');
  const fotoContainer = document.getElementById('fotoDecoracao-container');

  // Mostrar/esconder campo de foto baseado no checkbox
  decoracaoExtraCheckbox.addEventListener('change', () => {
    fotoContainer.style.display = decoracaoExtraCheckbox.checked ? 'block' : 'none';
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const body = {
      massa: fd.get('massa'),
      recheio: fd.get('recheio'),
      cobertura: fd.get('cobertura'),
      peso: Number(fd.get('peso')),
      decoracaoExtra: fd.get('decoracaoExtra') === 'on',
      fotoDecoracao: fd.get('fotoDecoracao') || null
    };

    try {
      const res = await fetch('/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Erro ao salvar');
      msg.textContent = 'Encomenda salva com sucesso.';
      form.reset();
      fotoContainer.style.display = 'none';
      setTimeout(() => location.href = '/listar.html', 800);
    } catch (err) {
      msg.textContent = 'Falha: ' + err.message;
    }
  });
});
