# Patch notes

## 2026-11-17

### Normalização de espaços em valores monetários

- Corrigida a comparação dos textos de subtotal e frete nos testes Cypress.
- `Intl.NumberFormat` pode inserir espaços não separáveis (`NBSP`) em valores como `R$ 136,00`. Eles parecem espaços comuns no log, mas falham numa comparação textual exata.
- O Page Object agora normaliza sequências de espaços antes de devolver esses textos aos specs. Os valores esperados continuam legíveis e centralizados na fixture.
- Aplicado aos cenários de sacola, checkout, ordenação e frete que comparam subtotal ou mensagens com valores.

Validação realizada: sintaxe dos arquivos JavaScript e fixture JSON.

## 2026-11-19

### Loja modular com JavaScript nativo

- CSS saiu do HTML e agora está em `styles.css`; a lógica foi movida para `app.js` como módulo ES do navegador.
- Ações da interface usam eventos delegados em vez de handlers inline. Os seletores `data-cy` foram mantidos para a suíte Cypress.
- O servidor local serve somente a página e os dois arquivos estáticos permitidos, com tipos MIME apropriados.
- Adicionados foco visível, descrição da página, estado acessível do botão da sacola e suporte a preferência por movimento reduzido.
- Removida a dependência de fontes externas; a loja funciona sem buscar recursos de terceiros.

Validação realizada: inspeção dos arquivos e verificação sintática do módulo JavaScript.

### Catálogo ampliado e navegação funcional

- Menu Casa, Acessórios e Novidades agora aplica o filtro correspondente na vitrine. Novidades reúne itens marcados explicitamente no catálogo.
- Catálogo expandido para 16 produtos, com quatro itens em cada categoria existente.
- Os dados dos produtos foram centralizados em `catalog.json`, consumido pela loja e diretamente pelos specs Cypress.
- A suíte agora deriva contagens, categorias, preços e ordenação do catálogo compartilhado e cobre os filtros do menu e a coleção Novidades.

Validação sintática realizada.

### Normalização dos valores esperados no Cypress

- Corrigida a comparação de subtotais quando `Intl.NumberFormat` retorna espaço não separável entre `R$` e o valor.
- O formatador compartilhado dos testes agora normaliza espaços esperados da mesma forma que o Page Object normaliza o texto exibido pela loja.
- O checkout também passou a usar esse formatador para evitar a mesma divergência em outros valores.

Validação Cypress: teste da sacola executado localmente pelo usuário com sucesso.

### Specs organizados por intenção

- Cenários existentes foram separados entre `cypress/e2e/happy-path/` e `cypress/e2e/edge-cases/`, mantendo arquivos menores por área funcional.
- Atualizadas a estratégia de testes, a estrutura do README e a lista TODO.

### Estoque por produto

- Cada item do catálogo agora define uma quantidade em estoque. A loja informa unidades disponíveis e sinaliza produtos esgotados.
- Os botões de compra e aumento de quantidade são bloqueados quando o estoque termina; alterações na sacola atualizam a disponibilidade exibida.
- Sacolas antigas são sanitizadas ao carregar para descartar produtos desconhecidos e limitar quantidades ao estoque atual.
- Specs cobrem a última unidade, produto esgotado, tentativa de exceder o estoque e restauração de uma sacola salva acima do limite.

## 2026-11-20

### Consumo de estoque no checkout

- Pedidos confirmados agora reduzem o estoque simulado e salvam o saldo no `localStorage`, que permanece após recarregar a página.
- Os testes começam com estoque limpo e cobrem a redução após uma compra.
- A documentação esclarece que esse saldo é local ao navegador e não representa inventário compartilhado.
