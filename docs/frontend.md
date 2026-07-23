# Arquitetura do Frontend

## Stack

| Ferramenta      | Finalidade                        |
|-----------------|-----------------------------------|
| React 18        | Biblioteca UI                     |
| Vite 5          | Build tool (HMR rápido)           |
| React Router v6 | Roteamento no cliente             |
| Zustand         | Gerenciamento de estado leve      |
| dnd-kit         | Toolkit de drag and drop          |
| Tailwind CSS 3  | Framework CSS utilitário          |
| Axios           | Cliente HTTP baseado em promises  |

## Estrutura do Projeto

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx       # Formulário de login (email/senha)
│   │   └── RegisterForm.jsx    # Cadastro (username/email/senha)
│   ├── board/
│   │   ├── ListColumn.jsx      # Coluna com dropzone e lista de cards
│   │   ├── CardItem.jsx        # Card arrastável com handle
│   │   ├── CardModal.jsx       # Modal com detalhes completos do card
│   │   └── LabelManager.jsx    # (não usado) Gerenciamento de etiquetas
│   └── layout/
│       └── Header.jsx          # Barra superior com nome do usuário + logout
├── pages/
│   ├── LoginPage.jsx           # /login
│   ├── RegisterPage.jsx        # /register
│   ├── BoardsPage.jsx          # /boards — lista de boards
│   └── BoardPage.jsx           # /boards/:id — quadro kanban
├── hooks/
│   └── useAuth.js              # Guard de autenticação + estado do usuário
├── services/
│   ├── api.js                  # Instância Axios (URL base)
│   ├── authService.js          # register, login, getMe
│   ├── boardService.js         # CRUD de boards
│   ├── listService.js          # CRUD de listas + reordenar
│   ├── cardService.js          # CRUD de cards + mover
│   ├── labelService.js         # CRUD de etiquetas
│   └── commentService.js       # CRUD de comentários
├── store/
│   ├── authStore.js            # Estado do usuário + persistência localStorage
│   └── boardStore.js           # Estado dos boards + listas + cards + ações
├── App.jsx                     # Definição das rotas
├── main.jsx                    # Raiz React + BrowserRouter
└── index.css                   # Diretivas Tailwind
```

## Rotas

| Caminho           | Página         | Descrição                |
|-------------------|----------------|--------------------------|
| `/login`          | LoginPage      | Entrar                   |
| `/register`       | RegisterPage   | Criar conta              |
| `/boards`         | BoardsPage     | Listar todos os boards   |
| `/boards/:id`     | BoardPage      | Visualizar quadro kanban |

## Arquitetura de Componentes

### BoardPage (Kanban)

Esta é a página interativa principal. Ela gerencia:

1. **DndContext** envolve toda a área do kanban
2. **ListColumn** são zonas `useDroppable`
3. **CardItem** são elementos arrastáveis `useSortable`
4. **DragOverlay** mostra um card fantasma durante o arrasto

Fluxo:
- `onDragStart`: identifica o card arrastado na store
- `onDragEnd`: calcula a lista alvo + posição, chama `PATCH /api/cards/{id}/move`

### CardModal

Abre como uma sobreposição fixa ao clicar em um card. Sub-componentes:
- Input de título editável
- Seletor de etiquetas com:
  - Badges coloridas das etiquetas selecionadas
  - Dropdown para adicionar/remover etiquetas
  - Criação inline de novas etiquetas (nome + seletor de 8 cores)
  - Edição e exclusão de etiquetas diretamente no dropdown
- Textarea de descrição editável
- Lista de comentários com formulário de adição
- Botão Salvar (chama `PUT /api/cards/{id}`)
- Botão Deletar com confirmação

## Gerenciamento de Estado (Zustand)

### authStore
- `user` — objeto do usuário atual (persistido no localStorage)
- `setUser(user)` — handler de login/register
- `logout()` — limpa o usuário

### boardStore
- `boards` — lista de todos os boards
- `currentBoard` — board atualmente visualizado
- `lists` — listas com cards aninhados
- `boardLabels` — etiquetas do board atual
- `loadBoards()`, `loadBoard(id)` — buscar da API (também carrega `boardLabels`)
- `createBoard(data)`, `deleteBoard(id)` — mutações
- `createList(id, data)`, `deleteList(id)` — operações de lista
- `createCard(id, data)`, `moveCard(id, data)`, `updateCard(id, data)`, `deleteCard(id)` — operações de card
- `loadLabels(id)`, `createLabel(id, data)`, `updateLabel(id, data)`, `deleteLabel(id)` — operações de etiqueta

## Serviços (Axios)

Cada arquivo de serviço encapsula chamadas da API. A instância `api.js` define `baseURL: http://localhost:8000` e `Content-Type: application/json`.

Nenhum interceptor de autenticação (tokens removidos).

## Comportamentos Principais

### Drag and Drop
- Usa `@dnd-kit/core` e `@dnd-kit/sortable`
- Cards são identificados por strings `card-{id}`
- Listas são zonas de drop identificadas por `list-{id}`
- Ao soltar, o card é movido otimisticamente no estado e via API
- A posição é calculada como `última_posição + 1` ao soltar no final de uma lista, ou a posição do card alvo ao soltar sobre um card

### Persistência do Card
- Editar um card requer clicar em "Salvar" no modal
- Sem auto-save ao perder o foco do campo
- As etiquetas são gerenciadas inline no modal do card (criar, editar, excluir e associar)

### Etiquetas (Labels)
- Cada etiqueta pertence a um board e possui nome + cor hexadecimal
- Relação muitos-para-muitos com cards via tabela `card_labels`
- 8 cores predefinidas: Vermelho, Laranja, Amarelo, Verde, Azul, Roxo, Rosa, Cinza
- Ao abrir o modal de um card, as etiquetas do board são carregadas e exibidas como badges coloridas
- É possível criar novas etiquetas diretamente no dropdown do modal do card sem fechá-lo

### Guarda de Navegação
- O hook `useAuth` redireciona para `/login` se não houver usuário armazenado
- O estado de autenticação é persistido no localStorage (sobrevive ao refresh)
