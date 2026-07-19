# BookStore Manager CLI

## Sobre o projeto

O BookStore Manager CLI é uma aplicação de linha de comando desenvolvida em Node.js, TypeScript e PostgreSQL, destinada ao gerenciamento de uma biblioteca. O sistema permite cadastrar e consultar autores, livros e clientes, além de controlar empréstimos, devoluções e a disponibilidade dos exemplares, aplicando regras de negócio para garantir a consistência das informações.

A aplicação foi desenvolvida seguindo uma arquitetura em camadas (Controllers, Services e Repositories), utilizando acesso direto ao banco de dados com SQL, boas práticas de organização do código e tratamento de erros, proporcionando uma base sólida para aplicações back-end.

## Objetivo

Desenvolver uma aplicação back-end completa para consolidar os conhecimentos adquiridos durante os estudos do módulo Carreira Tech - Trilha Desenvolvimento de Software, aplicando conceitos de arquitetura em camadas, persistência de dados, programação orientada a objetos e implementação de regras de negócio.

O projeto tem como foco exercitar desde a modelagem do banco de dados e criação das consultas SQL até a construção da lógica da aplicação, priorizando código organizado, reutilizável e de fácil manutenção.

## Tecnologias utilizadas

- Node.js;
- TypeScript;
- PostgreSQL;
- pgAdmin 4
- Git;
- GitHub;

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- PostgreSQL
- Git

## Como instalar

Clone o repositório:

```bash
git clone https://github.com/luizrd84/SCTEC-Projeto02-BookStore-Manager-CLI.git
```

Acesse a pasta do projeto, por exemplo:

```
cd SCTEC-Projeto02-BookStore-Manager-CLI
```

Instale as dependências:

```
npm install
```

Crie um arquivo chamado .env na raiz do projeto, utilizando como referência o arquivo .envExemplo e configure as credenciais de acesso ao banco de dados.

Crie um banco de dados chamado **sctec_bookstore** no PostgreSQL utilizando a ferramenta de sua preferência (recomenda-se o pgAdmin).

Execute o script para criar as tabelas e demais objetos do banco de dados:

```
npm run schema
```

## Como executar

Execute o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

## Estrutura do projeto

```
sctec-projeto02-bookstore-manager-cli/
│
├── src/
│    ├── main.ts
│    │
│    ├── controllers/
│    │    └── AutorController.ts
│    │    └── ClienteController.ts
│    │    └── EmprestimoController.ts
│    │    └── LivroController.ts
│    │
│    ├── database/
│    │    └── connectio.ts
│    │    └── createSchema.ts
│    │    └── schema.sql
│    │
│    ├── menus/
│    │    └── TerminalController.ts
│    │
│    ├── models/
│    │    ├── Autor.ts
│    │    ├── Cliente.ts
│    │    ├── Emprestimo.ts
│    │    ├── EmprestimoLivro.ts
│    │    ├── Livro.ts
│    │    └── DTOs/
│    │         ├── EmprestimoDetalhadoDTO.ts
│    │         └── LivroDisponivelDTO.ts
│    │
│    ├── repositories/
│    │    ├── AutorRepository.ts
│    │    ├── ClienteRepository.ts
│    │    ├── EmprestimoRepository.ts
│    │    └── LivroRepository.ts
│    │
│    ├── services/
│    │    ├── AutorService.ts
│    │    ├── ClienteService.ts
│    │    ├── EmprestimoService.ts
│    │    └── LivroService.ts
│    │
│    └── utils/
│         ├── ConsoleUtils.ts
│         └── CustomErrors.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Funcionalidades implementadas

- Cadastro de autores
- Cadastro de livros
- Cadastro de clientes
- Consulta de autores por ID e nome
- Consulta de livros por ID e nome
- Consulta de clientes por ID e nome
- Listagem de autores, livros e clientes
- Atualização de autores, livros e clientes
- Exclusão de autores, livros e clientes
- Registro de empréstimos de livros
- Registro de devoluções
- Controle automático da disponibilidade de exemplares
- Consulta de livros disponíveis para empréstimo
- Listagem de empréstimos em aberto
- Listagem de empréstimos atrasados
- Validação para evitar cadastros duplicados
- Validação da disponibilidade de exemplares antes da realização de um empréstimo
- Interface de linha de comando (CLI) com menu interativo
- Tratamento de erros e validação de entradas do usuário
- Outros relatórios

## Exemplos de utilização

### Telas mostrando a criação de um Cliente:

![alt text](docs/imagens%20do%20Readme/criarCliente1.png)

![alt text](docs/imagens%20do%20Readme/criarCliente2.png)

![alt text](docs/imagens%20do%20Readme/criarCliente3.png)

### Telas mostrando consulta de disponibilidade de um Livro:

![alt text](docs/imagens%20do%20Readme/disponibilidadeLivro1.png)

![alt text](docs/imagens%20do%20Readme/disponibilidadeLivro2.png)

## Melhorias futuras

- Implementar autenticação e controle de acesso por perfis de usuário
- Adicionar paginação nas consultas e listagens
- Permitir reservas de livros indisponíveis
- Implementar cálculo de multas para empréstimos em atraso
- Enviar notificações de vencimento e atraso por e-mail
- Desenvolver uma interface web para utilização do sistema
- Criar uma API REST para integração com aplicações externas

## Autor

- Desenvolvido por Luiz Ricardo Dias
