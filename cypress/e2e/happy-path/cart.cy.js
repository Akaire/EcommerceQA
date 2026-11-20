const StorePage = require('../../support/page-objects/store.page')
const { products, formatPrice, subtotalFor } = require('../../support/catalog')
const data = require('../../fixtures/store.json')

describe('Happy path — sacola', () => {
  const store = new StorePage()

  beforeEach(() => store.visit())

  it('recalcula quantidade e subtotal ao incrementar e decrementar', () => {
    const product = products.mug
    store.addProduct(product.name)
    store.openCart()

    store.increaseQuantity(product.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterIncrease))
    store.subtotalText().should('eq', formatPrice(subtotalFor(['mug', 'mug'])))

    store.decreaseQuantity(product.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.subtotalText().should('eq', formatPrice(product.price))
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

  it('concede frete grátis para um produto elegível', () => {
    store.addProduct(products.blanket.name)
    store.openCart()
    store.shippingMessageText().should('eq', data.shipping.freeShippingMessage)
  })

  it('adiciona a última unidade disponível e atualiza o catálogo', () => {
    const product = products.pen
    store.addProduct(product.name)

    store.cartCount().should('have.text', '1')
    store.stockStatus(product.name).should('contain', 'Limite de estoque')
    store.addButton(product.name).should('be.disabled')
  })
})
