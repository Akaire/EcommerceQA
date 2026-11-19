# Viva — automação E2E com Cypress

Loja de demonstração e suíte end-to-end. A aplicação é estática; a suíte valida os comportamentos do navegador sem depender de serviço externo.

## Requisitos

- Node.js 22 ou superior
- npm

## Começar

```bash
npm ci
npm run cy:run
```

O comando de testes inicia o servidor local, executa Cypress em modo headless e encerra o servidor ao final. Para abrir o runner interativo:

```bash
npm run cy:open
```

Para abrir somente a loja:

```bash
npm start
```

A loja fica em `http://127.0.0.1:4173`.

## Estrutura

- `index.html` — estrutura semântica da loja e seletores `data-cy`
- `styles.css` — estilos responsivos, foco visível e suporte a movimento reduzido
- `app.js` — módulo ES nativo com carrinho, filtros e eventos delegados
- `catalog.json` — catálogo único consumido pela loja e pelos specs Cypress
- `server.cjs` — servidor estático local, também exportável para o runner
- `scripts/cypress-runner.cjs` — inicia a loja e gerencia o processo Cypress
- `cypress/e2e/` — specs separados por catálogo, categorias, sacola e checkout
- `cypress/fixtures/store.json` — massa e resultados esperados
- `cypress/support/page-objects/store.page.js` — locators e ações reutilizáveis
- `cypress.config.cjs` — configuração de execução e retry em CI
- `.github/workflows/cypress.yml` — execução em push e pull request
- `docs/test-strategy.md` — escopo e limites da cobertura

## Cobertura

Busca, estado vazio, filtro por categoria e menu, coleção Novidades, ordenação, persistência da sacola, quantidade, remoção, checkout com múltiplos compradores, validação de email e CEP, e limite do frete grátis.

Os pedidos são simulados no navegador. Não há backend, API, estoque ou pagamento real.
