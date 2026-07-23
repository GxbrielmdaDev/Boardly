# Boardly - Organizador de Tarefas 

<p align="center">
  <img src="./frontend/src/assets/boardly.png" alt="Boardly Logo" width="400"/>
</p>

<p align="center">
  <strong>Organizador moderdo de tarefas, com interface intuitiva e gerenciamento de projetos</strong>
</p>

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0+-purple.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff.svg)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/SQLite-3+-003b57.svg)](https://www.sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Boardly é um Sistema completo e moderno de **Organização de Tarefas e Anotações Pessoais e Profissionais**, desenvolvido para otimizar e organizar a sua produtividade e gerenciamento de seus projetos.

## Início Rápido

```bash
./init.sh
```

Instala todas as dependências e inicia ambos os servidores. Acesse:

| Serviço   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:5173        |
| Backend   | http://localhost:8000        |
| API Docs  | http://localhost:8000/docs   |

## Limpeza

```bash
./clear.sh
```

Remove `.venv`, `node_modules`, `__pycache__`, banco de dados e artefatos de build.

---

## Arquitetura

```
Boardly/
├── backend/             # Python FastAPI
│   ├── app/
│   │   ├── main.py      # Ponto de entrada + CORS
│   │   ├── config.py    # Configurações de ambiente
│   │   ├── database.py  # Engine assíncrono SQLAlchemy + sessão
│   │   ├── models/      # Modelos ORM SQLAlchemy
│   │   ├── schemas/     # Modelos de request/response Pydantic
│   │   ├── routers/     # Manipuladores de rotas da API
│   │   └── auth/        # Helpers de autenticação
│   ├── requirements.txt
│   └── .env
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # Componentes UI (auth, board, layout)
│   │   ├── pages/       # Páginas das rotas
│   │   ├── hooks/       # Hooks React customizados
│   │   ├── services/    # Clientes Axios da API
│   │   └── store/       # Stores de estado Zustand
│   └── package.json
├── docs/                # Documentação
├── init.sh              # Setup com um clique
└── clear.sh             # Script de limpeza
```

---

## Stack Tecnológica

### Backend

| Ferramenta      | Finalidade                    |
|-----------------|-------------------------------|
| FastAPI         | Framework web assíncrono      |
| SQLAlchemy      | ORM                           |
| Pydantic        | Validação de schemas          |
| SQLite          | Banco de desenvolvimento      |
| Uvicorn         | Servidor ASGI                 |

### Frontend

| Ferramenta      | Finalidade                    |
|-----------------|-------------------------------|
| React 18        | Biblioteca UI                 |
| Vite 5          | Build tool                    |
| React Router v6 | Roteamento cliente            |
| Zustand         | Gerenciamento de estado       |
| dnd-kit         | Drag & drop                   |
| Tailwind CSS 3  | CSS utilitário                |
| Axios           | Cliente HTTP                  |

---

## Funcionalidades

- **Autenticação** — Registro e login
- **Boards** — Criar, renomear, deletar boards com cores de fundo personalizadas
- **Listas** — Adicionar, renomear, reordenar, deletar colunas dentro de um board
- **Cards** — Criar, editar, deletar cards com etiquetas e datas de vencimento
- **Drag & Drop** — Mover cards entre listas com dnd-kit
- **Comentários** — Adicionar e visualizar comentários nos cards
- **Detalhes do Card** — Modal com título editável, descrição, etiqueta e comentários

---

## Endpoints da API

| Método | Endpoint                     | Descrição                |
|--------|------------------------------|--------------------------|
| POST   | `/api/auth/register`         | Criar conta              |
| POST   | `/api/auth/login`            | Entrar                   |
| GET    | `/api/auth/me`               | Usuário atual            |
| GET    | `/api/boards/`               | Listar boards            |
| POST   | `/api/boards/`               | Criar board              |
| GET    | `/api/boards/{id}`           | Obter board              |
| PUT    | `/api/boards/{id}`           | Atualizar board          |
| DELETE | `/api/boards/{id}`           | Deletar board            |
| GET    | `/api/boards/{id}/lists`     | Listar listas do board   |
| POST   | `/api/boards/{id}/lists`     | Criar lista              |
| PUT    | `/api/lists/{id}`            | Atualizar lista          |
| DELETE | `/api/lists/{id}`            | Deletar lista            |
| PATCH  | `/api/lists/{id}/position`   | Reordenar lista          |
| GET    | `/api/lists/{id}/cards`      | Listar cards da lista    |
| POST   | `/api/lists/{id}/cards`      | Criar card               |
| GET    | `/api/cards/{id}`            | Obter card               |
| PUT    | `/api/cards/{id}`            | Atualizar card           |
| DELETE | `/api/cards/{id}`            | Deletar card             |
| PATCH  | `/api/cards/{id}/move`       | Mover card (lista+pos)   |
| GET    | `/api/cards/{id}/comments`   | Listar comentários       |
| POST   | `/api/cards/{id}/comments`   | Adicionar comentário     |
| DELETE | `/api/comments/{id}`         | Deletar comentário       |

Documentação completa em [/docs/api.md](docs/api.md).

---

## 📄 Licença

Este projeto está distribuído sob a licença **MIT**


---


### Desenvolvedor

**Gabriel Almeida**

- 🐙 GitHub: [@GxbrielmdaDev](https://github.com/GxbrielmdaDev)
- 💼 LinkedIn: [Gabriel Almeida](www.linkedin.com/in/gabriellmdadev)
-
