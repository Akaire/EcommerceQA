const StorePage = require('../../support/page-objects/store.page')
const data = require('../../fixtures/store.json')
const { products } = require('../../support/catalog')

describe('Edge cases — catálogo', () => {
  const store = new StorePage()

  beforeEach(() => store.visit())

  it('mostra estado vazio quando a busca não encontra produtos', () => {
    store.search(data.catalog.nonMatchingSearch)
    store.emptyResults()
      .should('be.visible')
      .and('contain', data.catalog.emptyResultsMessage)
  })

  it('identifica e bloqueia um produto sem estoque', () => {
    const product = products.pencilCase
    store.stockStatus(product.name).should('have.text', 'Fora de estoque')
    store.addButton(product.name).should('be.disabled')
  })
})
