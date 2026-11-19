const StorePage = require('../support/page-objects/store.page')
const data = require('../fixtures/store.json')
const { products, subtotalFor, formatPrice } = require('../support/catalog')

describe('Sacola de compras', () => {
  const store = new StorePage()

  beforeEach(() => {
    store.visit()
  })

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

  it('remove o último item e desabilita a finalização', () => {
    const product = products.mug
    store.addProduct(product.name)
    store.openCart()
    store.removeItem(product.name)

    store.cartItems().should('have.length', 0)
    store.emptyCart().should('be.visible')
    store.checkoutButton().should('be.disabled')
    store.cartCount().should('have.text', String(data.cart.quantityAfterOrder))
  })

  it('concede frete grátis exatamente no limite configurado', () => {
    const keys = data.shipping.freeShippingProductKeys
    keys.forEach((key) => store.addProduct(products[key].name))

    store.openCart()
    store.subtotalText().should('eq', formatPrice(subtotalFor(keys)))
    store.shippingMessageText().should('eq', data.shipping.freeShippingMessage)
  })

  it('informa quanto falta para o frete grátis abaixo do limite', () => {
    store.addProduct(products.mug.name)
    store.openCart()
    store.shippingMessageText().should('eq', data.shipping.belowThresholdMessage)
  })
})
