# Patch notes

## 2026-11-17 — Normalização de espaços em valores monetários

- Corrigida a comparação dos textos de subtotal e frete nos testes Cypress.
- `Intl.NumberFormat` pode inserir espaços não separáveis (`NBSP`) em valores como `R$ 136,00`. Eles parecem espaços comuns no log, mas falham numa comparação textual exata.
- O Page Object agora normaliza sequências de espaços antes de devolver esses textos aos specs. Os valores esperados continuam legíveis e centralizados na fixture.
- Aplicado aos cenários de sacola, checkout, ordenação e frete que comparam subtotal ou mensagens com valores.

Validação realizada: sintaxe dos arquivos JavaScript e fixture JSON.

## 2026-11-19 — Loja modular com JavaScript nativo

- CSS saiu do HTML e agora está em `styles.css`; a lógica foi movida para `app.js` como módulo ES do navegador.
- Ações da interface usam eventos delegados em vez de handlers inline. Os seletores `data-cy` foram mantidos para a suíte Cypress.
- O servidor local serve somente a página e os dois arquivos estáticos permitidos, com tipos MIME apropriados.
- Adicionados foco visível, descrição da página, estado acessível do botão da sacola e suporte a preferência por movimento reduzido.
- Removida a dependência de fontes externas; a loja funciona sem buscar recursos de terceiros.

Validação realizada: inspeção dos arquivos e verificação sintática do módulo JavaScript.

## 2026-11-19 — Catálogo ampliado e navegação funcional

- Menu Casa, Acessórios e Novidades agora aplica o filtro correspondente na vitrine. Novidades reúne itens marcados explicitamente no catálogo.
- Catálogo expandido para 16 produtos, com quatro itens em cada categoria existente.
- Os dados dos produtos foram centralizados em `catalog.json`, consumido pela loja e diretamente pelos specs Cypress.
- A suíte agora deriva contagens, categorias, preços e ordenação do catálogo compartilhado e cobre os filtros do menu e a coleção Novidades.

Validação sintática realizada.

## 2026-11-19 — Normalização dos valores esperados no Cypress

- Corrigida a comparação de subtotais quando `Intl.NumberFormat` retorna espaço não separável entre `R$` e o valor.
- O formatador compartilhado dos testes agora normaliza espaços esperados da mesma forma que o Page Object normaliza o texto exibido pela loja.
- O checkout também passou a usar esse formatador para evitar a mesma divergência em outros valores.

Validação Cypress: teste da sacola executado localmente pelo usuário com sucesso.
