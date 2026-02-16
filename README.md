
# 💸 MONETO - Financial Intelligence Platform
> Versão v0.1.0 (MVP)

O Moneto é uma plataforma de gestão financeira pessoal desenvolvida para consolidar fluxos de caixa e oferecer previsibilidade financeira. Este MVP foca na resolução do "caos informacional", centralizando dados que geralmente ficam dispersos entre múltiplas instituições bancárias e planilhas manuais.

1. PROPOSTA DE VALOR
---

- O objetivo central desta versão é a CENTRALIZAÇÃO E CLAREZA. Em vez de interfaces complexas, o Moneto entrega uma experiência frictionless para que o usuário entenda sua saúde financeira em segundos.

- > O PROBLEMA: A fragmentação de dados financeiros impede uma tomada de decisão precisa e gera gastos invisíveis.
- > A SOLUÇÃO: Uma interface unificada com back-end robusto para registro, categorização e análise de saldo em tempo real.

2. FUNCIONALIDADES (MVP v0.1.0)
---

* Gestão de Acesso: Autenticação segura baseada em JWT (JSON Web Tokens).
* Engine de Categorização: Sistema dinâmico de categorias para Receitas e Despesas.
* Controle Transacional: CRUD completo de movimentações financeiras.
* Dashboard Executivo: Visualização consolidada de Total de Entradas, Saídas e Saldo Líquido.

3. STACK TECNOLÓGICA
---

A escolha das tecnologias priorizou performance, tipagem estática e escalabilidade.

BACKEND:
- Go (Golang): Alta performance e concorrência nativa.
- Clean Architecture: Separação clara de preocupações (Entities, Use Cases, Adapters).
- PostgreSQL: Persistência de dados relacional com integridade referencial.
- JWT: Stateless authentication.

FRONTEND:
- React + TypeScript: Interface reativa com segurança de tipos.
- Vite: Tooling de última geração para workflow rápido.
- Context API: Gerenciamento de estado global simplificado.

4. ARQUITETURA E DADOS
---

O projeto utiliza uma estrutura de Monolito Modular, facilitando a transição para microsserviços caso a carga de trabalho exija no futuro.

ESTRUTURA DE BANCO DE DADOS:
- USERS: Gestão de perfis e credenciais.
- CATEGORIES: Dicionário de classificação financeira por usuário.
- TRANSACTIONS: Registro granular de movimentações (Débito/Crédito).


5. AUTOR
---

João Gabriel Vianna
Software Engineer | Backend Architecture & SaaS Specialist

> MONETO: Simplicidade no design, rigor na arquitetura.
