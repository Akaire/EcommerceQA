# Patch notes

## 2026-11-17 — Normalização de espaços em valores monetários

- Corrigida a comparação dos textos de subtotal e frete nos testes Cypress.
- `Intl.NumberFormat` pode inserir espaços não separáveis (`NBSP`) em valores como `R$ 136,00`. Eles parecem espaços comuns no log, mas falham numa comparação textual exata.
- O Page Object agora normaliza sequências de espaços antes de devolver esses textos aos specs. Os valores esperados continuam legíveis e centralizados na fixture.
- Aplicado aos cenários de sacola, checkout, ordenação e frete que comparam subtotal ou mensagens com valores.

Validação realizada: sintaxe dos arquivos JavaScript e fixture JSON. A suíte Cypress não foi executada nesta alteração.
