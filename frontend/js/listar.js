document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista');

  // Modal e campos
  const modal = document.getElementById('editModal');
  const btnCancel = document.getElementById('btn-cancel-edit');
  const btnSave = document.getElementById('btn-save-edit');

  const massaInput = document.getElementById('edit-massa');
  const recheioInput = document.getElementById('edit-recheio');
  const coberturaInput = document.getElementById('edit-cobertura');
  const pesoInput = document.getElementById('edit-peso');
  const decoracaoCheckbox = document.getElementById('edit-decoracaoExtra');
  const fotoInput = document.getElementById('edit-fotoDecoracao');
  const fotoContainer = document.getElementById('edit-fotoDecoracao-container');
  const fotoPreview = document.getElementById('edit-fotoPreview');

  let editingId = null;

  async function loadItems() {
    lista.textContent = 'Carregando...';

    try {
      const res = await fetch('/items');
      const items = await res.json();
      lista.innerHTML = '';

      if (!items.length) {
        lista.innerHTML = '<p>Nenhuma encomenda encontrada.</p>';
        return;
      }

      const ul = document.createElement('ul');

      items.forEach(it => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>Massa:</strong> ${it.massa}<br>
          <strong>Recheio:</strong> ${it.recheio}<br>
          <strong>Cobertura:</strong> ${it.cobertura}<br>
          <strong>Peso:</strong> ${it.peso} kg<br>
          <strong>Decoração extra:</strong> ${it.decoracaoExtra ? 'Sim' : 'Não'}
        `;

        if (it.fotoDecoracao) {
          const img = document.createElement('img');
          img.src = it.fotoDecoracao;
          img.style.maxWidth = '120px';
          img.style.display = 'block';
          img.style.margin = '10px 0';
          li.appendChild(img);
        }

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.className = 'btn btn-warning btn-sm me-2 mt-2';
        editBtn.onclick = () => abrirModalEditar(it);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Deletar';
        deleteBtn.className = 'btn btn-danger btn-sm mt-2';
        deleteBtn.onclick = () => deletarEncomenda(it.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        ul.appendChild(li);
      });

      lista.appendChild(ul);

    } catch (err) {
      lista.textContent = 'Erro: ' + err.message;
    }
  }

  function abrirModalEditar(item) {
    editingId = item.id;

    // Preencher campos
    massaInput.value = item.massa;
    recheioInput.value = item.recheio;
    coberturaInput.value = item.cobertura;
    pesoInput.value = item.peso;

    decoracaoCheckbox.checked = item.decoracaoExtra;
    fotoInput.value = item.fotoDecoracao || '';

    // Mostrar/esconder o container da foto
    fotoContainer.style.display = decoracaoCheckbox.checked ? "block" : "none";

    // PREVIEW da imagem
    if (item.fotoDecoracao) {
      fotoPreview.src = item.fotoDecoracao;
      fotoPreview.style.display = "block";
    } else {
      fotoPreview.src = "";
      fotoPreview.style.display = "none";
    }

    // Abrir modal
    modal.style.display = "flex";
  }

  // Fechar ao cancelar
  btnCancel.onclick = () => {
    modal.style.display = "none";
  };

  // Mostrar/esconder campo para foto
  decoracaoCheckbox.addEventListener("change", (e) => {
    fotoContainer.style.display = e.target.checked ? "block" : "none";
  });

  // Atualizar preview em tempo real
  fotoInput.addEventListener("input", () => {
    const url = fotoInput.value.trim();
    if (url) {
      fotoPreview.src = url;
      fotoPreview.style.display = "block";
    } else {
      fotoPreview.src = "";
      fotoPreview.style.display = "none";
    }
  });

  // Salvar edição
  btnSave.onclick = async () => {
    const updates = {
      massa: massaInput.value.trim(),
      recheio: recheioInput.value.trim(),
      cobertura: coberturaInput.value.trim(),
      peso: parseFloat(pesoInput.value),
      decoracaoExtra: decoracaoCheckbox.checked,
      fotoDecoracao: fotoInput.value.trim() || null
    };

    try {
      await fetch("/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match: { id: editingId },
          patch: updates
        }),
      });

      modal.style.display = "none";
      loadItems();

    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  // Deletar item
  async function deletarEncomenda(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    await fetch("/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match: { id } }),
    });

    loadItems();
  }

  // Carregar lista inicial
  loadItems();
});
