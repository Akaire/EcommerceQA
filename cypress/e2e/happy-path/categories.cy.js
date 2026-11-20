const StorePage = require('../../support/page-objects/store.page')
const { catalog, categories } = require('../../support/catalog')

describe('Happy path — categorias e navegação', () => {
  const store = new StorePage()

  beforeEach(() => store.visit())

  categories.forEach((name) => {
    const categoryProducts = catalog.filter((product) => product.category === name)

    it(`mostra os produtos da categoria ${name}`, () => {
      store.filterByCategory(name)
      store.products().should('have.length', categoryProducts.length)
      categoryProducts.forEach((product) => store.product(product.name).should('be.visible'))
    })
  })

  it('mostra os itens novos pela coleção Novidades', () => {
    const newProducts = catalog.filter((product) => product.isNew)
    store.navigateToCategory('Novidades')
    store.products().should('have.length', newProducts.length)

    newProducts.forEach((product) => store.product(product.name).should('be.visible'))
    store.products().each(($product) => {
      cy.wrap($product).should('have.attr', 'data-is-new', 'true')
    })
  })

  const menuCategories = ['Casa', 'Acessórios']
  menuCategories.forEach((category) => {
    it(`leva ao filtro ${category} pelo menu principal`, () => {
      const categoryProducts = catalog.filter((product) => product.category === category)
      store.navigateToCategory(category)
      store.products().should('have.length', categoryProducts.length)
      categoryProducts.forEach((product) => store.product(product.name).should('be.visible'))
    })
  })
})
