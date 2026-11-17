# Estratégia de testes Viva

## Objetivo

Verificar os fluxos críticos visíveis para uma pessoa compradora e detectar regressões no catálogo, na sacola e na finalização simulada.

## Cobertura atual

| Área | Cenários |
| --- | --- |
| Catálogo | Lista inicial, busca com resultado, busca vazia, ordenação ascendente e descendente |
| Categorias | Contagem e produtos esperados em cada categoria |
| Sacola | Persistência após recarga, incremento, decremento, remoção e estado vazio |
| Frete | Abaixo do limite e exatamente em R$ 199,00 |
| Checkout | Um item por categoria, segundo comprador, email inválido e CEP inválido/corrigido |

## Organização

- `data-cy` identifica controles de teste sem acoplar os testes às classes visuais.
- O Page Object centraliza locators e ações da interface.
- `store.json` mantém massa e expectativas de negócio usadas pelos cenários.
- Cada teste começa com uma página nova e a sacola limpa via `localStorage`.
- O Cypress roda com isolamento entre testes e um retry em modo headless para CI.

## Execução

- `npm ci` instala exatamente as dependências do lockfile.
- `npm run cy:run` inicia o servidor, executa headless e encerra o servidor.
- `npm run cy:open` inicia o servidor e abre o Cypress interativo.
- `npm start` serve a loja sem executar testes.

O workflow `.github/workflows/cypress.yml` executa `npm ci` e a suíte E2E em pushes e pull requests.

## Limites e próximos passos

A loja é estática: não há backend, API, autenticação real, estoque, pagamento nem persistência de pedidos no servidor. Os testes validam apenas o comportamento do frontend. Para um produto real, a próxima camada seria testar contratos e respostas da API, executar a suíte contra um ambiente efêmero e adicionar auditoria de acessibilidade e cobertura de navegadores.
