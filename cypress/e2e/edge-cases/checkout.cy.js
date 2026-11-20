const StorePage = require('../../support/page-objects/store.page')
const data = require('../../fixtures/store.json')
const { products } = require('../../support/catalog')

describe('Edge cases — checkout', () => {
  const store = new StorePage()
  const buyer = data.checkout.buyers[0]

  beforeEach(() => store.visit())

  data.checkout.invalidEmails.forEach((email) => {
    it(`bloqueia e-mail inválido: ${email}`, () => {
      store.addProduct(products.mug.name)
      store.openCart()
      store.checkout()
      store.fillCustomer({ ...buyer, email })
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
    store.fillCustomer({ ...buyer, cep: data.checkout.invalidCep })
    store.confirmOrder()
    store.cepError().should('contain', data.checkout.invalidCepMessage)

    store.setCep(buyer.cep)
    store.confirmOrder()
    store.orderConfirmation().should('contain', data.checkout.successMessage)
  })
})
