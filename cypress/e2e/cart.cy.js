const StorePage = require('../support/page-objects/store.page')
const data = require('../fixtures/store.json')

describe('Sacola de compras', () => {
  const store = new StorePage()

  beforeEach(() => {
    store.visit()
  })

  it('recalcula quantidade e subtotal ao incrementar e decrementar', () => {
    const product = data.products.mug
    store.addProduct(product.name)
    store.openCart()

    store.increaseQuantity(product.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterIncrease))
    store.subtotalText().should('eq', data.cart.subtotalAfterIncrease)

    store.decreaseQuantity(product.name)
    store.cartCount().should('have.text', String(data.cart.quantityAfterAdd))
    store.subtotalText().should('eq', product.priceLabel)
  })

  it('remove o último item e desabilita a finalização', () => {
    const product = data.products.mug
    store.addProduct(product.name)
    store.openCart()
    store.removeItem(product.name)

    store.cartItems().should('have.length', 0)
    store.emptyCart().should('be.visible')
    store.checkoutButton().should('be.disabled')
    store.cartCount().should('have.text', String(data.cart.quantityAfterOrder))
  })

  it('concede frete grátis exatamente no limite configurado', () => {
    data.shipping.freeShippingProductKeys.forEach((productKey) => {
      store.addProduct(data.products[productKey].name)
    })

    store.openCart()
    store.subtotalText().should('eq', data.shipping.freeShippingSubtotal)
    store.shippingMessageText().should('eq', data.shipping.freeShippingMessage)
  })

  it('informa quanto falta para o frete grátis abaixo do limite', () => {
    store.addProduct(data.products.mug.name)
    store.openCart()
    store.shippingMessageText().should('eq', data.shipping.belowThresholdMessage)
  })
})

