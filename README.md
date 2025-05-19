# Golden Raspberry – API de Pior Filme (TypeScript)

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.x-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

API RESTful em **nível 2 de maturidade Richardson** que carrega automaticamente a lista de indicados e vencedores do prêmio _Framboesa de Ouro_ (pior filme) a partir de um arquivo CSV e disponibiliza consultas em **SQLite em memória**.

> ✅ **Sem dependências externas** — basta Node 20+ e `npm`.

---

## Índice

1. [Características](#características)
2. [Pré‑requisitos](#pré-requisitos)
3. [Instalação](#instalação)
4. [Uso](#uso)

   1. [Executar em desenvolvimento](#executar-em-desenvolvimento)
   2. [Compilar para produção](#compilar-para-produção)

5. [Contrato da API](#contrato-da-api)
6. [Atualizando o CSV](#atualizando-o-csv)
7. [Testes](#testes)
8. [Estrutura do projeto](#estrutura-do-projeto)
9. [Licença](#licença)

---

## Características

- **TypeScript** + **ES Modules**: código moderno, tipado e compatível com ESM.
- **Express + TypeORM**: ORM simples apontando para SQLite em memória (`:memory:`).
- **Importação de CSV** na inicialização (ponto‑e‑vírgula como delimitador).
- **Endpoints REST** para filmes e estatísticas de produtores.
- **Testes de integração** com Jest + SuperTest.

## Pré‑requisitos

| Ferramenta | Versão | Observação                       |
| ---------- | ------ | -------------------------------- |
| Node.js    | ≥ 20.x | Inclui suporte a ESM sem _flag_. |
| npm        | ≥ 10.x | Instalado junto com Node         |

> 💡 **Dica Windows:** se aparecer erro nativo ao instalar `sqlite3`, execute `npm i --platform=win32 --arch=x64 sqlite3` ou use `better-sqlite3`.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/FelipeCararo/test-otsra.git
cd test-otsra
npm i
```

## Uso

### Executar em desenvolvimento

```bash
npm run dev
```

- Servidor inicia em **[http://localhost:3000](http://localhost:3000)**.
- Qualquer mudança em `src/**` recarrega a aplicação (`tsx watch`).

### Compilar para produção

```bash
npm run build      # gera dist/
npm start          # executa node dist/index.js
```

> Para alterar a porta em produção use `PORT=8080 npm start`.

## Contrato da API

| Método  | Rota                   | Descrição                                                                 | Exemplo de resposta                    |
| ------- | ---------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| **GET** | `/movies`              | Lista todos os filmes (suporta `?year=1985&winner=true` _WIP_)            | Array de objetos `Movie`               |
| **GET** | `/movies/:id`          | Busca filme por ID                                                        | Objeto `Movie` ou **404**              |
| **GET** | `/producers/intervals` | Estatística de produtores com menores e maiores intervalos entre vitórias | `{ min: Interval[], max: Interval[] }` |

### Exemplo `/producers/intervals`

```json
{
  "min": [
    {
      "producer": "Bo Derek",
      "interval": 1,
      "previousWin": 1984,
      "followingWin": 1985
    }
  ],
  "max": [
    {
      "producer": "Alan Ladd Jr.",
      "interval": 15,
      "previousWin": 1985,
      "followingWin": 2000
    }
  ]
}
```

## Atualizando o CSV

1. Abra **`csv/Movielist.csv`** e cole novos registros seguindo o cabeçalho:

```csv
year;title;studios;producers;winner
```

2. Salve em **UTF‑8** para preservar acentuação.
3. Reinicie a aplicação — o banco é recriado a cada subida.

## Testes

```bash
npm t
```

- `jest --runInBand` executa **apenas integração** (sem mocks).
- Um banco em memória dedicado é criado e destruído automaticamente.

## Estrutura do projeto

```text
.
├── csv/Movielist.csv           # base de dados de filmes
├── src
│   ├── index.ts              # bootstrap (CSV → DB → HTTP)
│   ├── app.ts                # Express + rotas
│   ├── db.ts                 # DataSource SQLite em memória
│   ├── entities/             # TypeORM entities
│   ├── repositories/         # Abstrações de repositório
│   ├── services/             # Lógica de negócio (intervalos)
│   └── routes/               # Rotas REST
└── test
    └── movie.e2e.spec.ts     # testes de integração
```

## Licença

[MIT](LICENSE) © 2025 — Felipe Cararo
