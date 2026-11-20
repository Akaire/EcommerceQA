const StorePage = require('../../support/page-objects/store.page')
const data = require('../../fixtures/store.json')
const { products, subtotalFor, formatPrice } = require('../../support/catalog')

describe('Happy path — checkout', () => {
  const store = new StorePage()
  const buyers = data.checkout.buyers

  beforeEach(() => store.visit())

  it('compra um produto de cada categoria', () => {
    const productKeys = data.checkout.onePerCategoryProductKeys
    productKeys.forEach((key) => store.addProduct(products[key].name))

    store.openCart()
    store.cartItems().should('have.length', productKeys.length)
    store.subtotalText().should('eq', formatPrice(subtotalFor(productKeys)))
    productKeys.forEach((key) => store.cartItem(products[key].name).should('be.visible'))

    store.checkout()
    store.fillCustomer(buyers[0])
    store.confirmOrder()
    store.orderConfirmation().should('contain', data.checkout.successMessage)
    store.cartCount().should('have.text', String(data.cart.quantityAfterOrder))
  })

  it('baixa o estoque ao confirmar a compra e mantém o saldo ao recarregar', () => {
    const product = products.pen
    store.addProduct(product.name)
    store.openCart()
    store.checkout()
    store.fillCustomer(buyers[0])
    store.confirmOrder()
    store.orderConfirmation().should('contain', data.checkout.successMessage)

    store.closeCheckout()
    store.stockStatus(product.name).should('have.text', 'Fora de estoque')
    store.addButton(product.name).should('be.disabled')

    cy.reload()
    store.stockStatus(product.name).should('have.text', 'Fora de estoque')
  })

  buyers.slice(1).forEach((buyer) => {
    it(`finaliza pedido para ${buyer.label}`, () => {
      const product = products[data.checkout.secondaryBuyerProductKey]
      store.addProduct(product.name)
      store.openCart()
      store.checkout()
      store.fillCustomer(buyer)
      store.confirmOrder()

      store.orderConfirmation().should('contain', data.checkout.successMessage)
      store.cartCount().should('have.text', String(data.cart.quantityAfterOrder))
    })
  })
})
