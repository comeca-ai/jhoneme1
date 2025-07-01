document.addEventListener('DOMContentLoaded', () => {
  // Elementos da UI
  const addFolderBtn = document.getElementById('add-folder-btn');
  const addPromptBtn = document.getElementById('add-prompt-btn');
  const searchInput = document.getElementById('search-input');
  const folderList = document.getElementById('folder-list');
  const promptDisplayArea = document.getElementById('prompt-display-area');

  // Modais
  const promptModal = document.getElementById('prompt-modal');
  const folderModal = document.getElementById('folder-modal');
  const closeModalBtns = document.querySelectorAll('.close-btn');

  // Botões dos modais
  const savePromptBtn = document.getElementById('save-prompt-btn');
  const saveFolderBtn = document.getElementById('save-folder-btn');

  // Inputs dos modais
  const promptTitleInput = document.getElementById('prompt-title');
  const promptContentInput = document.getElementById('prompt-content');
  const promptFolderSelect = document.getElementById('prompt-folder-select');
  const folderNameInput = document.getElementById('folder-name');
  const modalTitle = document.getElementById('modal-title');

  let currentEditingPromptId = null; // Para saber se estamos editando um prompt
  let prompts = []; // Cache local dos prompts
  let folders = []; // Cache local das pastas

  // --- Funções de abertura e fechamento de Modais ---
  function openModal(modal) {
    modal.style.display = 'block';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
    resetPromptModal();
    resetFolderModal();
  }

  closeModalBtns.forEach(btn => {
    btn.onclick = function() {
      closeModal(promptModal);
      closeModal(folderModal);
    }
  });

  window.onclick = function(event) {
    if (event.target == promptModal) {
      closeModal(promptModal);
    }
    if (event.target == folderModal) {
      closeModal(folderModal);
    }
  }

  function resetPromptModal() {
    modalTitle.textContent = 'Adicionar Novo Prompt';
    promptTitleInput.value = '';
    promptContentInput.value = '';
    promptFolderSelect.value = ''; // Ou a pasta padrão
    currentEditingPromptId = null;
    savePromptBtn.textContent = 'Salvar';
  }

  function resetFolderModal() {
    folderNameInput.value = '';
  }

  // --- Event Listeners para abrir modais ---
  addPromptBtn.addEventListener('click', () => {
    resetPromptModal();
    loadFoldersIntoSelect(); // Carrega pastas no select do modal de prompt
    openModal(promptModal);
  });

  addFolderBtn.addEventListener('click', () => {
    resetFolderModal();
    openModal(folderModal);
  });


  // --- Lógica de Armazenamento e CRUD ---

  async function loadInitialData() {
    const data = await chrome.storage.local.get(['prompts', 'folders']);
    prompts = data.prompts || [];
    folders = data.folders || [];
    renderFolders();
    renderPrompts(); // Por padrão, carrega todos os prompts
  }

  // --- Funções de CRUD para Pastas ---
  async function saveFolder() {
    const folderName = folderNameInput.value.trim();
    if (!folderName) {
      alert('O nome da pasta não pode estar vazio.');
      return;
    }
    const newFolder = { id: `folder-${Date.now()}`, name: folderName };
    folders.push(newFolder);
    await chrome.storage.local.set({ folders });
    closeModal(folderModal);
    renderFolders();
  }

  function renderFolders() {
    folderList.innerHTML = ''; // Limpa antes de renderizar
    // Opção "Todas"
    const allLi = document.createElement('li');
    allLi.textContent = 'Todos os Prompts';
    allLi.dataset.folderId = 'all'; // Identificador especial para todos
    if (!folderList.querySelector('.active') || folderList.querySelector('.active').dataset.folderId === 'all') {
        allLi.classList.add('active');
    }
    allLi.addEventListener('click', () => {
        setActiveFolder(allLi);
        renderPrompts();
    });
    folderList.appendChild(allLi);

    // Opção "Sem Pasta" (Raiz)
    const noFolderLi = document.createElement('li');
    noFolderLi.textContent = 'Sem Pasta';
    noFolderLi.dataset.folderId = ''; // Prompts sem folderId específico
     if (folderList.querySelector('.active')?.dataset.folderId === '') {
        noFolderLi.classList.add('active');
    }
    noFolderLi.addEventListener('click', () => {
        setActiveFolder(noFolderLi);
        renderPrompts('');
    });
    folderList.appendChild(noFolderLi);

    folders.forEach(folder => {
      const li = document.createElement('li');
      li.textContent = folder.name;
      li.dataset.folderId = folder.id;
      if (folderList.querySelector('.active')?.dataset.folderId === folder.id) {
        li.classList.add('active');
      }
      li.addEventListener('click', (e) => {
        // Evita que o clique no botão de excluir também selecione a pasta
        if (e.target.tagName === 'BUTTON') return;
        setActiveFolder(li);
        renderPrompts(folder.id);
      });

      const deleteFolderBtn = document.createElement('button');
      deleteFolderBtn.textContent = 'X'; // Simple 'X' for delete
      deleteFolderBtn.className = 'delete-folder-btn'; // Para estilização
      deleteFolderBtn.title = `Excluir pasta "${folder.name}"`;
      deleteFolderBtn.onclick = (e) => {
        e.stopPropagation(); // Impede que o clique no botão propague para o LI
        deleteFolder(folder.id);
      };
      li.appendChild(deleteFolderBtn);
      folderList.appendChild(li);
    });
    loadFoldersIntoSelect();
  }

  async function deleteFolder(folderIdToDelete) {
    if (!confirm(`Tem certeza que deseja excluir esta pasta? Os prompts dentro dela não serão excluídos, mas ficarão "Sem Pasta".`)) {
      return;
    }

    // Remove a pasta da lista de pastas
    folders = folders.filter(folder => folder.id !== folderIdToDelete);

    // Remove a associação de folderId dos prompts que estavam nesta pasta
    prompts = prompts.map(prompt => {
      if (prompt.folderId === folderIdToDelete) {
        return { ...prompt, folderId: '' }; // Manda para "Sem Pasta"
      }
      return prompt;
    });

    // Salva as alterações no storage
    await chrome.storage.local.set({ folders, prompts });

    // Re-renderiza a UI
    renderFolders();
    // Decide qual view de prompts mostrar. Pode ser 'all' ou a pasta que estava ativa antes, se não for a excluída.
    // Por simplicidade, vamos para 'all' ou manter a atual se não for a excluída.
    const currentActiveFolderId = getActiveFolderId();
    if (currentActiveFolderId === folderIdToDelete) {
        setActiveFolder(folderList.querySelector('li[data-folder-id="all"]')); // Ativa "Todos os Prompts"
        renderPrompts('all');
    } else {
        renderPrompts(currentActiveFolderId); // Mantém a pasta atual
    }
  }

  function setActiveFolder(selectedLi) {
    document.querySelectorAll('#folder-list li').forEach(li => li.classList.remove('active'));
    selectedLi.classList.add('active');
  }

  function getActiveFolderId() {
    const activeLi = folderList.querySelector('li.active');
    return activeLi ? activeLi.dataset.folderId : 'all';
  }

  function loadFoldersIntoSelect() {
    promptFolderSelect.innerHTML = '<option value="">Nenhuma (Raiz)</option>';
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folder.name;
      promptFolderSelect.appendChild(option);
    });
  }

  // --- Funções de CRUD para Prompts ---
  async function savePrompt() {
    const title = promptTitleInput.value.trim();
    const content = promptContentInput.value.trim();
    const folderId = promptFolderSelect.value; // Pode ser "" para raiz

    if (!title || !content) {
      alert('Título e conteúdo do prompt são obrigatórios.');
      return;
    }

    if (currentEditingPromptId) {
      // Editar prompt existente
      const promptIndex = prompts.findIndex(p => p.id === currentEditingPromptId);
      if (promptIndex > -1) {
        prompts[promptIndex] = { ...prompts[promptIndex], title, content, folderId };
      }
    } else {
      // Adicionar novo prompt
      const newPrompt = { id: `prompt-${Date.now()}`, title, content, folderId };
      prompts.push(newPrompt);
    }

    await chrome.storage.local.set({ prompts });
    closeModal(promptModal);
    renderPrompts(getActiveFolderId()); // Renderiza prompts da pasta ativa
    currentEditingPromptId = null; // Reseta o ID de edição
  }

  async function deletePrompt(promptId) {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) {
      return;
    }
    prompts = prompts.filter(p => p.id !== promptId);
    await chrome.storage.local.set({ prompts });
    renderPrompts(getActiveFolderId());
  }

  function editPrompt(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      currentEditingPromptId = prompt.id;
      modalTitle.textContent = 'Editar Prompt';
      promptTitleInput.value = prompt.title;
      promptContentInput.value = prompt.content;
      promptFolderSelect.value = prompt.folderId || ""; // Define a pasta correta, ou "" se não tiver
      savePromptBtn.textContent = 'Salvar Alterações';
      loadFoldersIntoSelect(); // Garante que as pastas estão carregadas no select
      openModal(promptModal);
    }
  }

  function renderPrompts(folderId = 'all', searchTerm = '') {
    promptDisplayArea.innerHTML = ''; // Limpa a área de exibição
    searchTerm = searchTerm.toLowerCase();

    let filteredPrompts = prompts;

    if (folderId && folderId !== 'all') {
        // Se folderId é uma string vazia, significa "Sem Pasta"
        // Se for um ID específico, filtra por esse ID
        filteredPrompts = prompts.filter(p => p.folderId === folderId);
    } else if (folderId === 'all') {
        // Não filtra por pasta, mostra todos
    }


    if (searchTerm) {
      filteredPrompts = filteredPrompts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm)
      );
    }

    if (filteredPrompts.length === 0) {
        promptDisplayArea.innerHTML = '<p>Nenhum prompt encontrado.</p>';
        return;
    }

    filteredPrompts.forEach(prompt => {
      const promptDiv = document.createElement('div');
      promptDiv.className = 'prompt-item';
      promptDiv.dataset.promptId = prompt.id;

      const titleEl = document.createElement('h4');
      titleEl.textContent = prompt.title;

      const contentEl = document.createElement('p');
      // Para preservar quebras de linha e espaços do prompt:
      contentEl.style.whiteSpace = 'pre-wrap';
      contentEl.textContent = prompt.content;


      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'prompt-actions';

      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copiar';
      copyBtn.className = 'copy-btn';
      copyBtn.addEventListener('click', (e) => copyPromptToClipboard(prompt.content, e.target));

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'edit-btn';
      editBtn.addEventListener('click', () => editPrompt(prompt.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Excluir';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => deletePrompt(prompt.id));

      actionsDiv.appendChild(copyBtn);
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      promptDiv.appendChild(titleEl);
      promptDiv.appendChild(contentEl);
      promptDiv.appendChild(actionsDiv);

      promptDisplayArea.appendChild(promptDiv);
    });
  }

  // --- Função para copiar para a área de transferência ---
  async function copyPromptToClipboard(text, copyButtonElement) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Prompt copiado para a área de transferência!');

      // Visual feedback on the button
      const originalText = copyButtonElement.textContent;
      copyButtonElement.textContent = 'Copiado!';
      copyButtonElement.disabled = true; // Disable briefly
      setTimeout(() => {
        copyButtonElement.textContent = originalText;
        copyButtonElement.disabled = false;
      }, 1500); // Reset after 1.5 seconds

    } catch (err) {
      console.error('Falha ao copiar o prompt: ', err);
      const originalText = copyButtonElement.textContent;
      copyButtonElement.textContent = 'Falhou!';
      setTimeout(() => {
        copyButtonElement.textContent = originalText;
      }, 1500);
    }
  }


  // --- Event Listeners para salvar ---
  saveFolderBtn.addEventListener('click', saveFolder);
  savePromptBtn.addEventListener('click', savePrompt);

  // --- Event Listener para busca ---
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderPrompts(getActiveFolderId(), searchTerm);
  });

  // --- Event Listeners para lista de pastas (já tratados em renderFolders) ---
  // A lógica de clique nas pastas é adicionada dinamicamente em renderFolders.

  // --- Inicialização ---
  loadInitialData();

  // Placeholder para funcionalidades futuras
  console.log('MeuPrompt popup.js carregado.');
});

// Funções utilitárias (podem ser movidas para um arquivo separado depois)
// Ex: Gerar ID único, etc.
