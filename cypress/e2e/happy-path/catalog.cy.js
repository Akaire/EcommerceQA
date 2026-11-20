const StorePage = require('../../support/page-objects/store.page')
const { catalog, products } = require('../../support/catalog')

describe('Happy path — catálogo', () => {
  const store = new StorePage()

  beforeEach(() => store.visit())

  it('carrega os recursos estáticos e o catálogo compartilhado', () => {
    cy.request('/styles.css').its('headers.content-type').should('include', 'text/css')
    cy.request('/app.js').its('headers.content-type').should('include', 'javascript')
    cy.request('/catalog.json').its('body').should('have.length', catalog.length)
  })

  it('lista produtos e permite buscar pelo nome', () => {
    store.products().should('have.length', catalog.length)
    store.search(products.mug.name)
    store.products().should('have.length', 1)
    store.product(products.mug.name).should('be.visible')
  })

  it('ordena produtos do menor para o maior preço e vice-versa', () => {
    const cheapest = [...catalog].sort((first, second) => first.price - second.price)[0]
    const mostExpensive = [...catalog].sort((first, second) => second.price - first.price)[0]

    store.sortBy('low')
    store.firstProduct().should('contain', cheapest.name)
    store.lastProduct().should('contain', mostExpensive.name)

    store.sortBy('high')
    store.firstProduct().should('contain', mostExpensive.name)
    store.lastProduct().should('contain', cheapest.name)
  })
})
