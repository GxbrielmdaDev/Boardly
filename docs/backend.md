# Arquitetura do Backend

## Stack

| Ferramenta       | Versão | Finalidade                       |
|------------------|--------|----------------------------------|
| Python           | 3.12+  | Runtime                          |
| FastAPI          | 0.115  | Framework web assíncrono         |
| SQLAlchemy       | 2.0    | ORM com suporte assíncrono       |
| Pydantic         | 2.9    | Validação de schemas (integrado ao FastAPI) |
| SQLite + aiosqlite | -    | Banco de desenvolvimento (async) |
| Uvicorn          | 0.30   | Servidor ASGI com hot reload     |

## Estrutura

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # App FastAPI, lifespan, CORS, inclusão de rotas
│   ├── config.py            # Configurações do .env via pydantic-settings
│   ├── database.py          # Engine assíncrono, factory de sessão, Base, create_tables
│   ├── models/
│   │   ├── __init__.py      # Re-exporta todos os modelos
│   │   ├── user.py          # Modelo User
│   │   ├── board.py         # Modelos Board + BoardMember
│   │   ├── list.py          # Modelo List
│   │   ├── card.py          # Modelo Card
│   │   └── comment.py       # Modelos Comment + Activity
│   ├── schemas/
│   │   ├── __init__.py      # Re-exporta todos os schemas
│   │   ├── user.py          # UserCreate, UserLogin, UserResponse
│   │   ├── board.py         # BoardCreate, BoardUpdate, BoardResponse, BoardMember*
│   │   ├── list.py          # ListCreate, ListUpdate, ListResponse
│   │   ├── card.py          # CardCreate, CardUpdate, CardMove, CardResponse
│   │   └── comment.py       # CommentCreate, CommentResponse
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # /api/auth/*
│   │   ├── boards.py        # /api/boards/*
│   │   ├── lists.py         # /api/*/lists, /api/lists/*
│   │   ├── cards.py         # /api/*/cards, /api/cards/*
│   │   └── comments.py      # /api/*/comments, /api/comments/*
│   └── auth/
│       ├── __init__.py
│       └── jwt.py           # Helper get_default_user
├── requirements.txt
└── .env
```

## Modelos do Banco de Dados

```
User ──┬── Board (dono)
       ├── BoardMember ─── Board (membro)
       ├── Comment ──── Card
       └── Activity ─── Card

Board ──┬── List ──── Card ──┬── Comment
        │                    └── Activity
        └── BoardMember ──── User
```

### User
| Campo         | Tipo     | Observações           |
|---------------|----------|-----------------------|
| id            | Integer  | PK                    |
| username      | String   | único, indexado       |
| email         | String   | único, indexado       |
| password_hash | String   | texto puro (sem auth) |
| avatar_url    | String?  | anulável              |
| created_at    | DateTime | automático            |

### Board
| Campo            | Tipo     | Observações           |
|------------------|----------|-----------------------|
| id               | Integer  | PK                    |
| title            | String   |                       |
| description      | Text?    | anulável              |
| background_color | String   | hex color #rrggbb     |
| owner_id         | Integer  | FK → users.id         |
| created_at       | DateTime | automático            |
| updated_at       | DateTime | automático ao atualizar |

### BoardMember
| Campo   | Tipo    | Observações                   |
|---------|---------|-------------------------------|
| id      | Integer | PK                            |
| board_id| Integer | FK → boards.id                |
| user_id | Integer | FK → users.id                 |
| role    | String  | owner, admin, member          |

### List
| Campo    | Tipo    | Observações           |
|----------|---------|-----------------------|
| id       | Integer | PK                    |
| title    | String  |                       |
| position | Float   | para ordenação        |
| board_id | Integer | FK → boards.id        |
| created_at| DateTime| automático            |

### Card
| Campo       | Tipo      | Observações           |
|-------------|-----------|-----------------------|
| id          | Integer   | PK                    |
| title       | String    |                       |
| description | Text?     | anulável              |
| position    | Float     | para ordenação        |
| list_id     | Integer   | FK → lists.id         |
| assignee_id | Integer?  | FK → users.id         |
| due_date    | DateTime? | anulável              |
| label       | String?   | anulável              |
| created_at  | DateTime  | automático            |
| updated_at  | DateTime  | automático ao atualizar |

### Comment
| Campo     | Tipo      | Observações           |
|-----------|-----------|-----------------------|
| id        | Integer   | PK                    |
| content   | Text      |                       |
| card_id   | Integer   | FK → cards.id         |
| user_id   | Integer   | FK → users.id         |
| created_at| DateTime  | automático            |

## Decisões de Design

### 1. Totalmente Assíncrono
Todas as operações de banco usam a sessão assíncrona do SQLAlchemy com `aiosqlite`. Os endpoints são `async def`, proporcionando boa concorrência para trabalho I/O-bound.

### 2. Sem Autenticação (por enquanto)
O sistema usa o helper `get_default_user` que retorna o primeiro usuário (ou cria um com `id=1`). Esse modo "rascunho" permite desenvolvimento rápido sem gerenciamento de tokens.

### 3. Posicionamento Fracionado
Listas e cards usam `Float` para `position`. Para inserir entre itens, use um valor intermediário entre os vizinhos (ex.: `1.5` entre `1.0` e `2.0`). Nenhum reindex é realizado.

### 4. CORS
Configurado para `http://localhost:5173` (servidor dev do Vite). Expanda em produção.

### 5. Criação do Banco
As tabelas são criadas automaticamente na inicialização através do lifespan do FastAPI chamando `Base.metadata.create_all`.

## Executando

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Ou use `./init.sh` a partir da raiz do projeto.
