const StorePage = require('../support/page-objects/store.page')
const { catalog, products, formatPrice } = require('../support/catalog')

describe('Loja Viva', () => {
  const store = new StorePage()
  let data

  beforeEach(() => {
    cy.fixture('store').then((fixture) => {
      data = fixture
    })
    store.visit()
  })

  it('carrega a folha de estilos, o módulo e o catálogo compartilhado', () => {
    cy.request('/styles.css')
      .its('headers.content-type')
      .should('include', 'text/css')

    cy.request('/app.js')
      .its('headers.content-type')
      .should('include', 'javascript')

    cy.request('/catalog.json')
      .its('body')
      .should('have.length', catalog.length)
  })

  it('lista o catálogo e permite buscar pelo nome', () => {
    store.products().should('have.length', catalog.length)
    store.search(products.mug.name)
    store.products().should('have.length', 1)
    store.product(products.mug.name).should('be.visible')
  })

  it('mostra o estado vazio quando a busca não encontra produtos', () => {
    store.search(data.catalog.nonMatchingSearch)
    store.emptyResults()
      .should('be.visible')
      .and('contain', data.catalog.emptyResultsMessage)
  })

  it('ordena produtos do menor para o maior preço e vice-versa', () => {
    const cheapest = [...catalog].sort((first, second) => first.price - second.price)[0]
    const mostExpensive = [...catalog].sort((first, second) => second.price - first.price)[0]

    store.sortBy('low')
    store.firstProduct().should('contain', cheapest.name)
    store.lastProduct().should('contain', mostExpensive.name)

    store.sortBy('high')
    store.firstProduct().should('contain', mostExpensive.name)
    store.lastProduct().should('contain', cheapest.name)
  })

  it('mantém a sacola após recarregar a página', () => {
    store.addProduct(products.mug.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.openCart()
    store.subtotalText().should('eq', formatPrice(products.mug.price))

    cy.reload()
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.openCart()
    store.cartItem(products.mug.name).should('be.visible')
  })

  it('aplica frete grátis para um produto elegível', () => {
    store.addProduct(products.blanket.name)
    store.openCart()
    store.shippingMessageText().should('eq', data.shipping.freeShippingMessage)
  })
})
