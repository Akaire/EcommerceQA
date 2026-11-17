const StorePage = require('../support/page-objects/store.page')
const data = require('../fixtures/store.json')

describe('Filtro por categoria', () => {
  const store = new StorePage()

  beforeEach(() => {
    store.visit()
  })

  data.catalog.categories.forEach((category) => {
    it(`mostra os produtos da categoria ${category.name}`, () => {
      store.filterByCategory(category.name)
      store.products().should('have.length', category.productCount)

      category.products.forEach((productKey) => {
        store.product(data.products[productKey].name).should('be.visible')
      })
    })
  })
})
