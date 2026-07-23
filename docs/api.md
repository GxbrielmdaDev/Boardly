# Referência da API

URL Base: `http://localhost:8000`

---

## Autenticação

### Registrar

Cria uma nova conta de usuário.

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Resposta** `201 Created`

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "avatar_url": null,
  "created_at": "2026-07-22T16:34:29"
}
```

**Erros**
- `409 Conflict` — email ou username já existe

---

### Login

Autentica com email e senha (comparação em texto puro).

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Resposta** `200 OK`

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "avatar_url": null,
  "created_at": "2026-07-22T16:34:29"
}
```

**Erros**
- `401 Unauthorized` — credenciais inválidas

---

### Obter Usuário Atual

Retorna o usuário padrão (id=1). Usado como verificação simples de identidade.

```http
GET /api/auth/me
```

**Resposta** `200 OK`

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "avatar_url": null,
  "created_at": "2026-07-22T16:34:29"
}
```

---

## Boards

### Listar Boards

```http
GET /api/boards/
```

**Resposta** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Project Alpha",
    "description": null,
    "background_color": "#0f172a",
    "owner_id": 1,
    "created_at": "2026-07-22T16:34:29",
    "updated_at": "2026-07-22T16:34:29"
  }
]
```

### Criar Board

```http
POST /api/boards/
Content-Type: application/json

{
  "title": "Project Alpha",
  "description": "Meu board da equipe",
  "background_color": "#1e3a5f"
}
```

A cor de fundo padrão é `#0f172a`. Descrição é opcional.

**Resposta** `201 Created` — retorna o board criado.

### Obter Board

```http
GET /api/boards/{board_id}
```

**Resposta** `200 OK` — retorna o board.

**Erros**
- `404 Not Found` — board não existe

### Atualizar Board

```http
PUT /api/boards/{board_id}
Content-Type: application/json

{
  "title": "Título Atualizado",
  "description": "Nova descrição",
  "background_color": "#2d1b69"
}
```

Todos os campos são opcionais (apenas os fornecidos são atualizados).

**Resposta** `200 OK` — retorna o board atualizado.

### Deletar Board

```http
DELETE /api/boards/{board_id}
```

**Resposta** `204 No Content`

---

## Listas

Listas são colunas dentro de um board.

### Listar Listas

```http
GET /api/boards/{board_id}/lists
```

**Resposta** `200 OK`

```json
[
  {
    "id": 1,
    "title": "A Fazer",
    "position": 1.0,
    "board_id": 1,
    "created_at": "2026-07-22T16:34:29"
  }
]
```

Resultados ordenados por `position` crescente.

### Criar Lista

```http
POST /api/boards/{board_id}/lists
Content-Type: application/json

{
  "title": "Em Andamento"
}
```

A posição é atribuída automaticamente ao final.

**Resposta** `201 Created`

### Atualizar Lista

```http
PUT /api/lists/{list_id}
Content-Type: application/json

{
  "title": "Lista Renomeada",
  "position": 2.5
}
```

Ambos os campos são opcionais.

**Resposta** `200 OK`

### Deletar Lista

```http
DELETE /api/lists/{list_id}
```

Também deleta todos os cards dentro da lista (cascade).

**Resposta** `204 No Content`

### Reordenar Lista

```http
PATCH /api/lists/{list_id}/position
Content-Type: application/json

{
  "position": 3.0
}
```

Use posições fracionadas (ex.: `1.5`, `2.0`, `3.5`) para inserir entre listas existentes sem reindexar.

**Resposta** `200 OK`

---

## Cards

### Listar Cards

```http
GET /api/lists/{list_id}/cards
```

**Resposta** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Implementar login",
    "description": "Adicionar autenticação",
    "position": 1.0,
    "list_id": 1,
    "assignee_id": null,
    "due_date": null,
    "label": "Funcionalidade",
    "created_at": "2026-07-22T16:34:29",
    "updated_at": "2026-07-22T16:34:29"
  }
]
```

### Criar Card

```http
POST /api/lists/{list_id}/cards
Content-Type: application/json

{
  "title": "Implementar login",
  "description": "Adicionar autenticação",
  "assignee_id": null,
  "due_date": null,
  "label": "Funcionalidade"
}
```

Apenas `title` é obrigatório. Posição é atribuída automaticamente ao final.

**Resposta** `201 Created`

### Obter Card

```http
GET /api/cards/{card_id}
```

**Resposta** `200 OK`

### Atualizar Card

```http
PUT /api/cards/{card_id}
Content-Type: application/json

{
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "label": "Bug"
}
```

Todos os campos opcionais. Apenas os fornecidos são atualizados.

**Resposta** `200 OK`

### Deletar Card

```http
DELETE /api/cards/{card_id}
```

Também deleta todos os comentários do card (cascade).

**Resposta** `204 No Content`

### Mover Card

Move um card para uma lista diferente e/ou posição.

```http
PATCH /api/cards/{card_id}/move
Content-Type: application/json

{
  "list_id": 2,
  "position": 1.0
}
```

Use posições fracionadas (ex.: `0.5`, `1.5`, `3.0`) para posicionar cards entre os existentes.

**Resposta** `200 OK`

---

## Comentários

### Listar Comentários

```http
GET /api/cards/{card_id}/comments
```

**Resposta** `200 OK`

```json
[
  {
    "id": 1,
    "content": "Belo card!",
    "card_id": 1,
    "user_id": 1,
    "created_at": "2026-07-22T16:34:29"
  }
]
```

### Criar Comentário

```http
POST /api/cards/{card_id}/comments
Content-Type: application/json

{
  "content": "Isto é um comentário"
}
```

**Resposta** `201 Created`

### Deletar Comentário

```http
DELETE /api/comments/{comment_id}
```

**Resposta** `204 No Content`

---

## Formato de Erro

Todos os erros retornam:

```json
{
  "detail": "Descrição da mensagem de erro"
}
```

Códigos HTTP comuns:
- `201` — recurso criado
- `204` — recurso deletado (sem corpo)
- `400` — requisição inválida (dados incorretos)
- `404` — recurso não encontrado
- `409` — conflito (duplicado)
