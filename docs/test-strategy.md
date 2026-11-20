# Estratégia de testes Viva

## Objetivo

Verificar os fluxos críticos visíveis para uma pessoa compradora e detectar regressões no catálogo, na sacola e na finalização simulada.

## Cobertura atual

| Área | Cenários |
| --- | --- |
| Happy path — catálogo e categorias | Recursos carregados, busca com resultado, ordenação, categorias, menu e coleção Novidades |
| Happy path — sacola e checkout | Quantidade, persistência, última unidade disponível, consumo local do estoque no pedido, item elegível ao frete e compra válida |
| Edge cases — catálogo | Busca sem resultados e produto sem estoque |
| Edge cases — sacola e frete | Remoção do último item, limite de estoque, sacola salva acima do estoque, abaixo e exatamente no limite de R$ 199,00 |
| Edge cases — checkout | E-mails inválidos e CEP inválido com correção |

## Organização

- `happy-path/` e `edge-cases/` separam os testes pela intenção do cenário, mantendo specs pequenos por área.
- `data-cy` identifica controles sem acoplar testes às classes visuais.
- O Page Object centraliza locators e ações da interface.
- `catalog.json` é a fonte única dos produtos, importada pela loja e pelos specs.
- `store.json` mantém dados de compradores e expectativas que não pertencem ao catálogo.
- Cada teste começa com uma página nova e a sacola limpa via `localStorage`.
- O Cypress roda com isolamento entre testes e um retry em modo headless para CI.

## Execução

- `npm ci` instala exatamente as dependências do lockfile.
- `npm run cy:run` inicia o servidor, executa headless e encerra o servidor.
- `npm run cy:open` inicia o servidor e abre o Cypress interativo.
- `npm start` serve a loja sem executar testes.

O workflow `.github/workflows/cypress.yml` executa `npm ci` e a suíte E2E em pushes e pull requests.

## Limites e próximos passos

A loja é estática: não há backend, API, autenticação real, estoque compartilhado entre pessoas, pagamento nem persistência de pedidos no servidor. O estoque simulado fica no navegador, em `localStorage`. Os testes validam apenas o comportamento do frontend. Para um produto real, a próxima camada seria testar contratos e respostas da API, executar a suíte contra um ambiente efêmero e adicionar auditoria de acessibilidade e cobertura de navegadores.
