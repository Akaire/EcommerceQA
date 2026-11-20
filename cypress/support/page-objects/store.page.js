class StorePage {
  visit() {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.removeItem('viva-cart')
        window.localStorage.removeItem('viva-stock')
      },
    })
  }

  products() {
    return cy.get('[data-cy="product-card"]')
  }

  firstProduct() {
    return this.products().first()
  }

  lastProduct() {
    return this.products().last()
  }

  product(name) {
    return this.products().contains('h3', name).parents('[data-cy="product-card"]')
  }

  stockStatus(name) {
    return this.product(name).find('[data-cy="stock-status"]')
  }

  addButton(name) {
    return this.product(name).find('[data-cy="add-to-cart"]')
  }

  search(query) {
    cy.get('[data-cy="product-search"]').clear().type(query)
  }

  sortBy(value) {
    cy.get('[data-cy="product-sort"]').select(value)
  }

  filterByCategory(category) {
    cy.get('[data-cy="category-filter"]').filter(`[data-category="${category}"]`).click()
  }

  navigateToCategory(category) {
    cy.get('[data-cy="nav-category"]').filter(`[data-category="${category}"]`).click()
  }

  addProduct(name) {
    this.product(name).find('[data-cy="add-to-cart"]').click()
  }

  openCart() {
    cy.get('[data-cy="cart-open"]').click()
  }

  cartCount() {
    return cy.get('[data-cy="cart-count"]')
  }

  cartItems() {
    return cy.get('[data-cy="cart-item"]')
  }

  cartItem(name) {
    return this.cartItems().contains('strong', name).parents('[data-cy="cart-item"]')
  }

  increaseQuantity(name) {
    this.increaseQuantityButton(name).click()
  }

  increaseQuantityButton(name) {
    return this.cartItem(name).find('[data-cy="quantity-increase"]')
  }

  cartQuantity(name) {
    return this.cartItem(name).find('[data-cy="cart-quantity"]')
  }

  decreaseQuantity(name) {
    this.cartItem(name).find('[data-cy="quantity-decrease"]').click()
  }

  removeItem(name) {
    this.cartItem(name).find('[data-cy="remove-item"]').click()
  }

  emptyCart() {
    return cy.get('[data-cy="empty-cart"]')
  }

  checkoutButton() {
    return cy.get('[data-cy="checkout"]')
  }

  normalizedText(selector) {
    return cy.get(selector)
      .invoke('text')
      .then((text) => text.replace(/\s+/gu, ' ').trim())
  }

  subtotalText() {
    return this.normalizedText('[data-cy="cart-subtotal"]')
  }

  shippingMessageText() {
    return this.normalizedText('[data-cy="shipping-message"]')
  }

  emptyResults() {
    return cy.get('[data-cy="empty-results"]')
  }

  cepError() {
    return cy.get('[data-cy="cep-error"]')
  }

  customerEmail() {
    return cy.get('[data-cy="customer-email"]')
  }

  orderConfirmation() {
    return cy.get('[data-cy="order-confirmation"]')
  }

  checkout() {
    this.checkoutButton().click()
  }

  closeCheckout() {
    cy.get('[data-action="close-checkout"]').click()
  }

  fillCustomer({ name, email, cep }) {
    cy.get('[data-cy="customer-name"]').type(name)
    this.customerEmail().type(email)
    this.setCep(cep)
  }

  setCep(cep) {
    cy.get('[data-cy="customer-cep"]').clear().type(cep)
  }

  confirmOrder() {
    cy.get('[data-cy="confirm-order"]').click()
  }
}

module.exports = StorePage
