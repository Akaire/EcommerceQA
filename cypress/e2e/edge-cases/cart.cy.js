const StorePage = require('../../support/page-objects/store.page')
const data = require('../../fixtures/store.json')
const { products, subtotalFor, formatPrice } = require('../../support/catalog')

describe('Edge cases — sacola e frete', () => {
  const store = new StorePage()

  beforeEach(() => store.visit())

  it('remove o último item e impede finalizar uma sacola vazia', () => {
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

  it('não permite adicionar além do estoque disponível', () => {
    const product = products.mug
    for (let quantity = 0; quantity < product.stock; quantity += 1) {
      store.addProduct(product.name)
    }

    store.addButton(product.name).should('be.disabled')
    store.stockStatus(product.name).should('contain', 'Limite de estoque')
    store.openCart()
    store.cartQuantity(product.name).should('have.text', String(product.stock))
    store.increaseQuantityButton(product.name).should('be.disabled')
  })

  it('limita à disponibilidade itens recuperados de uma sacola salva', () => {
    const product = products.mug
    const savedQuantity = product.stock + 3

    cy.window().then((window) => {
      window.localStorage.setItem('viva-cart', JSON.stringify({ [product.id]: savedQuantity }))
    })
    cy.reload()

    store.cartCount().should('have.text', String(product.stock))
    store.openCart()
    store.cartQuantity(product.name).should('have.text', String(product.stock))
  })
})
