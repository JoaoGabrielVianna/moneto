# 💸 Dashboard Financeiro Dark — Fullstack Go + React

> Projeto fullstack completo desenvolvido do zero em 1 final de semana, com objetivo de aprender, aplicar e mostrar domínio em Go, PostgreSQL, Docker e React.  
> Inspirado no estilo **Code with Antonio** — vídeo em breve no canal!

## 🎯 Objetivo

Criar um sistema de finanças pessoais completo e visualmente moderno, com foco em:

- Receitas e despesas mensais
- Cartões de crédito
- Investimentos e saldo investido
- Categorias personalizadas
- Autenticação de usuários
- Layout **dark mode**, responsivo e limpo
- Arquitetura **modular e escalavel** (com estilo monolito modular)

---

## 🧠 Tecnologias e Ferramentas

| Camada             | Stack                      |
|--------------------|----------------------------|
| **Frontend**       | React + Vite + TailwindCss |
| **Backend**        | Go (com o minimo de libs)  |
| **Banco de Dados** | PostgresSQL                |
| **Infra**          | Docker + Docker Compose    |

---

## 🗂️ Estrutura do Projeto

```bash
moneto/
├── frontend/
├── services/
│ ├── despesas/
│ ├── receitas/
│ ├── investimentos/
│ ├── cartoes/
│ ├── categorias/
│ └── pessoas/
├── database/
├── docker-compose.yml
└── README.md
```

## 🚀 Endpoints / Métodos por Service

1. Users (Autenticação e Usuários)

### 1. Users (Autenticação e Usuários)

| Método                                                                 | Endpoint            | Parâmetros                        | Descrição                  |
| ---------------------------------------------------------------------- | ------------------- | --------------------------------- | -------------------------- |
| ![POST](https://img.shields.io/badge/POST-green?style=for-the-badge)   | `/user/create`      | `name`, `email`, `password`       | Criar usuário              |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/user/{id}`        | `id`                              | Buscar usuário por ID      |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/users`            | `id`, `name`, `email` (opcional)  | Listar usuários            |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/users/me`         | `user_id`                         | Buscar usuário             |
| ![PUT](https://img.shields.io/badge/PUT-orange?style=for-the-badge)    | `/user/update/{id}` | `id`, `name`, `email`, `password` | Atualizar dados do usuário |
| ![DELETE](https://img.shields.io/badge/DELETE-red?style=for-the-badge) | `/user/delete/{id}` | `id`                              | Remover usuário            |


#### User Table

| Type | Label              |
|------|--------------------|
| uuid         | id         |
| varchar(36)  | name       |
| varchar(255) | email      |
| varchar(255) | password   |
| timestamp    | created_at |
| timestamp    | updated_at |



### 2. Incomes (Receitas)

| Método                                                                 | Endpoint              | Parâmetros                                 | Descrição                  |
| ---------------------------------------------------------------------- | --------------------- | ------------------------------------------ | -------------------------- |
| ![POST](https://img.shields.io/badge/POST-green?style=for-the-badge)   | `/income/create`      | `user_id`, `amount`, `category_id`, `date` | Criar receita              |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/income/{id}`        | `id`                                       | Buscar receita por ID      |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/income/all`         | `user_id`                                  | Listar receitas do usuário |
| ![PUT](https://img.shields.io/badge/PUT-orange?style=for-the-badge)    | `/income/update/{id}` | `id`, `amount`, `category_id`, `date`      | Atualizar receita          |
| ![DELETE](https://img.shields.io/badge/DELETE-red?style=for-the-badge) | `/income/delete/{id}` | `id`                                       | Remover receita            |

### Incomes Table

| Type         | Label       |
|--------------|-------------|
| uuid         | id          |
| varchar(255) | user_id     |
| numeric      | amount      |
| timestamp    | created_at  |
| timestamp    | updated_at  |
| text         | category_id |
| text         | descroption |
| text         | notes       |
| date         | date        |

### 3. Expenses (Despesas)

| Método                                                                 | Endpoint               | Parâmetros                                 | Descrição                  |
| ---------------------------------------------------------------------- | ---------------------- | ------------------------------------------ | -------------------------- |
| ![POST](https://img.shields.io/badge/POST-green?style=for-the-badge)   | `/expense/create`      | `user_id`, `amount`, `category_id`, `date` | Criar despesa              |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/expense/{id}`        | `id`                                       | Buscar despesa por ID      |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/expense/all`         | `user_id`                                  | Listar despesas do usuário |
| ![PUT](https://img.shields.io/badge/PUT-orange?style=for-the-badge)    | `/expense/update/{id}` | `id`, `amount`, `category_id`, `date`      | Atualizar despesa          |
| ![DELETE](https://img.shields.io/badge/DELETE-red?style=for-the-badge) | `/expense/delete/{id}` | `id`                                       | Remover despesa            |

#### Expenses Table

| Type         | Label       |
|--------------|-------------|
| uuid         | id          |
| varchar(255) | user_id     |
| numeric      | amount      |
| timestamp    | created_at  |
| timestamp    | updated_at  |
| text         | category_id |
| text         | descroption |
| text         | notes       |
| date         | date        |

### 4. Categories (Categorias)

| Método                                                                 | Endpoint                | Parâmetros                  | Descrição               |
| ---------------------------------------------------------------------- | ----------------------- | --------------------------- | ----------------------- |
| ![POST](https://img.shields.io/badge/POST-green?style=for-the-badge)   | `/category/create`      | `name`, `description`       | Criar categoria         |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/category/{id}`        | `id`                        | Buscar categoria por ID |
| ![GET](https://img.shields.io/badge/GET-blue?style=for-the-badge)      | `/category/all`         | -                           | Listar categorias       |
| ![PUT](https://img.shields.io/badge/PUT-orange?style=for-the-badge)    | `/category/update/{id}` | `id`, `name`, `description` | Atualizar categoria     |
| ![DELETE](https://img.shields.io/badge/DELETE-red?style=for-the-badge) | `/category/delete/{id}` | `id`                        | Remover categoria       |

#### Category Table

| Type         | Label      |
|--------------|------------|
| uuid        | id          |
| varchar(36) | name        |
| numeric     | type        |
| text        | descroption |
| varchar(36) | color       |
| timestamp   | created_at  |
| timestamp   | updated_at  |



## ✨ Autor
João Gabriel Vianna
🔗 [Linkedin](https://www.linkedin.com/in/joaogabrielvianna/)
📽️ Projeto pessoal