
# 🚀 User Service - Moneto

Este serviço é responsável pelo gerenciamento de usuários na aplicação Moneto.  
Implementa operações CRUD para usuários com uma arquitetura limpa, usando Go, PostgreSQL e documentação automática via Swagger.

---

## ✨ Funcionalidades

- 🆕 Criar usuário  
- ✏️ Atualizar usuário parcialmente  
- ❌ Deletar usuário  
- 🔍 Buscar usuário por ID  
- 📋 Listar usuários com filtros opcionais  

---

## 🛠 Tecnologias

- 🐹 Go  
- 🐘 PostgreSQL  
- 📚 Swagger (via swaggo)  
- 🌐 Context para gerenciamento de requisições  
- 🧱 Estrutura modularizada (domain, usecase, repository, delivery)  

---

## 📂 Estrutura do projeto
```bash
services/user-service/
├─ cmd/           # 🏁 Aplicação principal (entrypoint)
├─ config/        # ⚙️ Configurações e ambiente
├─ internal/
│  ├─ bootstrat/  # 🚦 Inicialização do servidor e usecase
│  ├─ delivery/   # 🌐 Handlers HTTP (REST API)
│  ├─ domain/     # 📦 Modelos de domínio e interfaces
│  ├─ repository/ # 🗄 Implementações de repositórios (Postgres)
│  ├─ usecase/    # 📖 Regras de negócio
│  └─ docs/       # 📄 Documentação Swagger gerada
├─ go.mod         # 📦 Módulo Go
└─ go.sum         # 🔒 Checksums das dependências
```

---

## ⚙️ Rodando o serviço localmente

1. Configure seu banco PostgreSQL (via docker-compose ou local).  
2. Crie arquivo `.env` na raiz com as variáveis necessárias (ex: `DB_URL`).  
3. Rode as migrations:  
```bash
cd services/user-service
go run cmd/main.go migrate
```
4. Inicie o servidor:  
```bash
go run cmd/main.go
```
5. O serviço estará disponível em:  
```
http://localhost:3000
```

---

## 📖 Documentação da API (Swagger)

Após rodar o serviço, acesse a documentação interativa em:  
```
http://localhost:3000/swagger/index.html
```

Para gerar ou atualizar a documentação Swagger:  
```bash
make docs
```

---

## 🔥 Endpoints principais

| Método | Endpoint          | Descrição                   |
| ------ | ----------------- | --------------------------- |
| POST   | /user/create      | 🆕 Cria um novo usuário     |
| PUT    | /user/update/{id} | ✏️ Atualiza dados do usuário |
| DELETE | /user/delete/{id} | ❌ Deleta usuário pelo ID   |
| GET    | /user/{id}        | 🔍 Busca usuário pelo ID    |
| GET    | /users            | 📋 Lista usuários com filtros |

---

## 🧰 Makefile

Possui comandos para rodar o serviço e gerar documentação. Execute na raiz do projeto.

---

Qualquer dúvida ou sugestão, só chamar! 🚀
