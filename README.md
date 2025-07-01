# MeuPrompt - Gerenciador de Prompts para IA

**MeuPrompt** é uma extensão para navegadores baseados em Chromium (como Google Chrome, Brave, etc.) projetada para ajudar você a salvar, organizar e gerenciar seus prompts para diversas ferramentas de Inteligência Artificial (ChatGPT, Gemini, Claude, etc.).

Com o MeuPrompt, você pode manter sua coleção de prompts sempre à mão, organizada em pastas e facilmente pesquisável.

## Funcionalidades

*   **Salvar Prompts:** Guarde seus prompts com título e conteúdo.
*   **Organizar em Pastas:** Crie pastas para categorizar seus prompts (ex: "Trabalho", "Estudos", "Marketing").
*   **Pesquisa Rápida:** Encontre prompts buscando por palavras no título ou no conteúdo.
*   **Copiar com Um Clique:** Copie o conteúdo do prompt para a área de transferência instantaneamente com o botão "Copiar".
*   **Editar e Excluir:** Modifique ou remova prompts e pastas conforme necessário.
*   **Interface Limpa:** Navegação intuitiva com uma barra lateral para pastas e uma área principal para visualização dos prompts.
*   **Armazenamento Local:** Seus dados são salvos localmente no seu navegador usando `chrome.storage.local`.

## Instalação (Desenvolvedor)

Como esta extensão ainda não está publicada na Chrome Web Store, você pode instalá-la manualmente seguindo estes passos:

1.  **Baixe os arquivos da extensão:**
    *   Clone este repositório ou baixe o código-fonte como .zip e extraia-o para uma pasta no seu computador.

2.  **Abra as Extensões do Navegador:**
    *   Em seu navegador Chromium (Chrome, Brave, Edge), vá para a página de gerenciamento de extensões. Você pode geralmente encontrá-la digitando `chrome://extensions` ou `brave://extensions` na barra de endereço.

3.  **Ative o Modo de Desenvolvedor:**
    *   No canto superior direito da página de extensões, ative a opção "Modo de desenvolvedor" (Developer mode).

4.  **Carregue a Extensão:**
    *   Clique no botão "Carregar sem compactação" (Load unpacked).
    *   Navegue até a pasta onde você extraiu os arquivos da extensão e selecione-a.

5.  **Pronto!**
    *   A extensão "MeuPrompt" deve aparecer na sua lista de extensões e o ícone dela deve ser adicionado à barra de ferramentas do navegador. Clique no ícone para começar a usar!

## Como Usar

1.  **Abrir a Extensão:**
    *   Clique no ícone do MeuPrompt na barra de ferramentas do seu navegador.

2.  **Gerenciar Pastas:**
    *   **Criar:** Clique no botão "Nova Pasta" na barra lateral, digite o nome e salve.
    *   **Selecionar:** Clique em uma pasta na barra lateral para ver os prompts contidos nela. "Todos os Prompts" mostra todos os seus prompts, e "Sem Pasta" mostra prompts que não foram atribuídos a nenhuma pasta específica.
    *   **Excluir:** Passe o mouse sobre uma pasta (exceto "Todos os Prompts" e "Sem Pasta") e clique no botão "X" que aparece. Os prompts dentro da pasta excluída serão movidos para "Sem Pasta".

3.  **Gerenciar Prompts:**
    *   **Criar:** Clique no botão "Novo Prompt". Preencha o título, o conteúdo do prompt e, opcionalmente, selecione uma pasta. Clique em "Salvar".
    *   **Visualizar:** Os prompts da pasta selecionada (ou todos/sem pasta) são listados na área principal.
    *   **Copiar:** Clique no botão "Copiar" em qualquer prompt para copiar seu conteúdo para a área de transferência. O botão indicará "Copiado!" por um breve momento.
    *   **Editar:** Clique no botão "Editar". Modifique os campos necessários no modal e salve as alterações.
    *   **Excluir:** Clique no botão "Excluir" e confirme a exclusão.

4.  **Pesquisar Prompts:**
    *   Use a barra de "Pesquisar prompts..." no topo da área principal para filtrar os prompts visíveis por título ou conteúdo. A pesquisa é aplicada dentro da visualização de pasta atual (ou em todos os prompts se "Todos os Prompts" estiver selecionado).

## Estrutura dos Arquivos

*   `manifest.json`: Define as configurações e permissões da extensão.
*   `popup.html`: A estrutura HTML da interface principal da extensão.
*   `style.css`: Os estilos CSS para a interface.
*   `popup.js`: Contém toda a lógica JavaScript para o funcionamento da extensão (gerenciamento de dados, interações da UI).
*   `background.js`: Service worker da extensão (atualmente com funcionalidade mínima, como log de instalação).
*   `icons/`: Contém os ícones da extensão em diferentes tamanhos (atualmente placeholders).
*   `README.md`: Este arquivo.

## Possíveis Melhorias Futuras

*   Renomear pastas.
*   Sincronização de prompts entre navegadores usando `chrome.storage.sync`.
*   Funcionalidade de exportar e importar prompts (para backup ou compartilhamento).
*   Suporte a mais ícones visuais para ações.
*   Internacionalização (suporte a múltiplos idiomas).
*   Teclas de atalho para ações comuns.
*   Melhorias avançadas de acessibilidade (ARIA).

## Contribuição

Este é um projeto simples. Sinta-se à vontade para clonar, modificar e melhorar!

---

Aproveite o MeuPrompt para organizar suas ideias e otimizar seu fluxo de trabalho com ferramentas de IA!
