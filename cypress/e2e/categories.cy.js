const StorePage = require('../support/page-objects/store.page')
const { catalog, categories } = require('../support/catalog')

describe('Filtro por categoria e navegação', () => {
  const store = new StorePage()

  beforeEach(() => {
    store.visit()
  })

  const categoryGroups = categories.map((name) => ({
    name,
    products: catalog.filter((product) => product.category === name),
  }))
  const newProducts = catalog.filter((product) => product.isNew)

  categoryGroups.forEach(({ name, products }) => {
    it(`mostra os produtos da categoria ${name}`, () => {
      store.filterByCategory(name)
      store.products().should('have.length', products.length)

      products.forEach((product) => {
        store.product(product.name).should('be.visible')
      })
    })
  })

  it('filtra a coleção de novidades pelo menu e pelo catálogo', () => {
    store.navigateToCategory('Novidades')
    store.products().should('have.length', newProducts.length)

    newProducts.forEach((product) => {
      store.product(product.name).should('be.visible')
    })
    store.products().each(($product) => {
      cy.wrap($product).should('have.attr', 'data-is-new', 'true')
    })
  })

  const menuCategories = ['Casa', 'Acessórios']
  menuCategories.forEach((category) => {
    it(`leva ao filtro ${category} pelo menu principal`, () => {
      const matchingProducts = catalog.filter((product) => product.category === category)
      store.navigateToCategory(category)
      store.products().should('have.length', matchingProducts.length)

      matchingProducts.forEach((product) => {
        store.product(product.name).should('be.visible')
      })
    })
  })
})
