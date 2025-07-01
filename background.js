chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão MeuPrompt instalada.');
  // Aqui você pode configurar valores iniciais no chrome.storage se necessário
  // Exemplo: chrome.storage.local.set({ prompts: [], folders: [] });
});

// Outras lógicas de background podem ser adicionadas aqui,
// como listeners para mensagens do popup ou content scripts,
// ou para interações com a API do Chrome que exigem um service worker.
