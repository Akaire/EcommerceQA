const StorePage = require('../support/page-objects/store.page')
const data = require('../fixtures/store.json')
const { products, subtotalFor, formatPrice } = require('../support/catalog')

describe('Finalização de compra', () => {
  const store = new StorePage()
  const buyers = data.checkout.buyers

  beforeEach(() => {
    store.visit()
  })

  it('compra um produto de cada categoria', () => {
    const productKeys = data.checkout.onePerCategoryProductKeys

    productKeys.forEach((productKey) => {
      store.addProduct(products[productKey].name)
    })

    store.openCart()
    store.cartItems().should('have.length', productKeys.length)
    store.subtotalText().should('eq', formatPrice(subtotalFor(productKeys)))
    productKeys.forEach((productKey) => {
      store.cartItem(products[productKey].name).should('be.visible')
    })

    store.checkout()
    store.fillCustomer(buyers[0])
    store.confirmOrder()
    store.orderConfirmation().should('contain', data.checkout.successMessage)
    store.cartCount().should('have.text', String(data.cart.quantityAfterOrder))
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

  data.checkout.invalidEmails.forEach((email) => {
    it(`impede finalizar compra com email inválido: ${email}`, () => {
      store.addProduct(products.mug.name)
      store.openCart()
      store.checkout()
      store.fillCustomer({ ...buyers[0], email })
      store.confirmOrder()

      store.customerEmail().should(($input) => {
        expect($input[0].validity.valid).to.equal(false)
      })
      store.orderConfirmation().should('not.exist')
    })
  })

  it('mostra erro para CEP inválido e permite corrigir antes de confirmar', () => {
    store.addProduct(products.mug.name)
    store.openCart()
    store.checkout()
    store.fillCustomer({ ...buyers[0], cep: data.checkout.invalidCep })
    store.confirmOrder()
    store.cepError().should('contain', data.checkout.invalidCepMessage)

    store.setCep(buyers[0].cep)
    store.confirmOrder()
    store.orderConfirmation().should('contain', data.checkout.successMessage)
  })
})
