const StorePage = require('../support/page-objects/store.page')

describe('Loja Viva', () => {
  const store = new StorePage()
  let data

  beforeEach(() => {
    cy.fixture('store').then((fixture) => {
      data = fixture
    })
    store.visit()
  })

  it('lista produtos e permite buscar pelo nome', () => {
    store.products().should('have.length', data.catalog.initialProductCount)
    store.search(data.products.mug.name)
    store.products().should('have.length', data.catalog.searchResultCount)
    store.product(data.products.mug.name).should('be.visible')
  })

  it('mostra o estado vazio quando a busca não encontra produtos', () => {
    store.search(data.catalog.nonMatchingSearch)
    store.emptyResults()
      .should('be.visible')
      .and('contain', data.catalog.emptyResultsMessage)
  })

  it('ordena produtos do menor para o maior preço e vice-versa', () => {
    store.sortBy('low')
    store.firstProduct().should('contain', data.products[data.catalog.priceSort.lowestProductKey].name)
    store.lastProduct().should('contain', data.products[data.catalog.priceSort.highestProductKey].name)

    store.sortBy('high')
    store.firstProduct().should('contain', data.products[data.catalog.priceSort.highestProductKey].name)
    store.lastProduct().should('contain', data.products[data.catalog.priceSort.lowestProductKey].name)
  })

  it('mantém a sacola após recarregar a página', () => {
    store.addProduct(data.products.mug.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.openCart()
    store.subtotalText().should('eq', data.products.mug.priceLabel)

    cy.reload()
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.openCart()
    store.cartItem(data.products.mug.name).should('be.visible')
  })

  it('aplica frete grátis para um produto elegível', () => {
    store.addProduct(data.products.blanket.name)
    store.openCart()
    store.shippingMessageText().should('eq', data.shipping.freeShippingMessage)
  })
})

