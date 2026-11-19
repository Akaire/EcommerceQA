let products = []

const CART_STORAGE_KEY = 'viva-cart'
const FREE_SHIPPING_THRESHOLD = 199
let categories = []
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}')
let activeCategory = 'Todos'
let toastTimer

const money = (value) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function renderFilters() {
  const filters = document.getElementById('filters')

  filters.innerHTML = categories.map((category) => `
    <button
      class="chip ${activeCategory === category ? 'active' : ''}"
      data-cy="category-filter"
      data-category="${category}"
      data-action="filter-category"
    >${category}</button>
  `).join('')
}

function setCategory(category) {
  activeCategory = category
  renderFilters()
  renderProducts()
}

function getVisibleProducts() {
  const query = document.getElementById('busca').value.trim().toLocaleLowerCase('pt-BR')
  const sortOrder = document.getElementById('ordem').value

  return products
    .filter((product) => {
      const matchesCategory = activeCategory === 'Todos'
        || (activeCategory === 'Novidades' ? product.isNew : product.category === activeCategory)
      const searchableText = `${product.name} ${product.category} ${product.desc}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && searchableText.includes(query)
    })
    .sort((first, second) => {
      if (sortOrder === 'low') return first.price - second.price
      if (sortOrder === 'high') return second.price - first.price
      if (sortOrder === 'name') return first.name.localeCompare(second.name, 'pt-BR')
      return first.id - second.id
    })
}

function renderProduct(product) {
  return `
    <article class="card" data-cy="product-card" data-is-new="${product.isNew}" data-product-id="${product.id}">
      <div class="photo" style="background:${product.bg}">
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
        <button class="heart" data-cy="favorite-toggle" data-action="favorite" aria-pressed="false" aria-label="Favoritar ${product.name}">♡</button>
        <span class="emoji">${product.emoji}</span>
      </div>
      <div class="details">
        <div class="category">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="desc">${product.desc}</div>
        <div class="buyrow">
          <span class="price">${money(product.price)}</span>
          <button class="add" data-cy="add-to-cart" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Adicionar ${product.name} à sacola">+</button>
        </div>
      </div>
    </article>
  `
}

function renderProducts() {
  const grid = document.getElementById('products')
  const visibleProducts = getVisibleProducts()

  grid.innerHTML = visibleProducts.length
    ? visibleProducts.map(renderProduct).join('')
    : '<div class="empty" data-cy="empty-results">Nenhum produto encontrado. Tente outra busca ou categoria.</div>'
}

function getCartCount() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
}

function getCartSubtotal() {
  return products.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0)
}

function persistCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  updateCart()
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1
  persistCart()
  showToast('Produto adicionado à sacola!')
}

function changeQuantity(productId, amount) {
  cart[productId] = (cart[productId] || 0) + amount
  if (cart[productId] <= 0) delete cart[productId]
  persistCart()
}

function removeFromCart(productId) {
  delete cart[productId]
  persistCart()
}

function renderCartItem(product) {
  return `
    <div class="cartrow" data-cy="cart-item" data-product-id="${product.id}">
      <div class="cartthumb" style="background:${product.bg}">${product.emoji}</div>
      <div>
        <strong>${product.name}</strong>
        <small>${money(product.price)}</small>
        <div class="qty">
          <button data-cy="quantity-decrease" data-action="decrease-quantity" data-product-id="${product.id}" aria-label="Diminuir ${product.name}">−</button>
          <span>${cart[product.id]}</span>
          <button data-cy="quantity-increase" data-action="increase-quantity" data-product-id="${product.id}" aria-label="Aumentar ${product.name}">+</button>
        </div>
      </div>
      <button class="remove" data-cy="remove-item" data-action="remove-item" data-product-id="${product.id}">Remover</button>
    </div>
  `
}

function updateCart() {
  const count = getCartCount()
  const subtotal = getCartSubtotal()
  const cartProducts = products.filter((product) => cart[product.id])

  document.getElementById('count').textContent = count
  document.getElementById('drawerCount').textContent = count
  document.getElementById('subtotal').textContent = money(subtotal)
  document.getElementById('checkout').disabled = count === 0
  document.getElementById('shippingnote').textContent = getShippingMessage(count, subtotal)
  document.getElementById('cartitems').innerHTML = count
    ? cartProducts.map(renderCartItem).join('')
    : '<div class="empty" data-cy="empty-cart">Sua sacola ainda está vazia.<br>Que tal encontrar um favorito?</div>'
}

function getShippingMessage(count, subtotal) {
  if (count === 0) return 'Adicione produtos para começar.'
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 'Você ganhou frete grátis!'
  return `Faltam ${money(FREE_SHIPPING_THRESHOLD - subtotal)} para ganhar frete grátis.`
}

function openCart() {
  document.getElementById('overlay').classList.add('show')
  document.getElementById('drawer').classList.add('show')
  document.querySelector('[data-action="open-cart"]').setAttribute('aria-expanded', 'true')
}

function closeCart() {
  document.getElementById('overlay').classList.remove('show')
  document.getElementById('drawer').classList.remove('show')
  document.querySelector('[data-action="open-cart"]').setAttribute('aria-expanded', 'false')
}

function showToast(message) {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200)
}

function showCheckout() {
  closeCart()
  const subtotal = getCartSubtotal()
  document.getElementById('modal').innerHTML = `
    <button class="close" style="position:absolute;right:20px;top:18px" data-action="close-checkout" aria-label="Fechar finalização">×</button>
    <div class="eyebrow">Quase lá</div>
    <h2>Finalizar pedido</h2>
    <p>Preencha seus dados para simular a conclusão da compra.</p>
    <form id="orderform" data-cy="checkout-form">
      <div class="formrow">
        <label for="nome">Nome completo</label>
        <input id="nome" data-cy="customer-name" name="nome" required minlength="3" placeholder="Seu nome">
        <div class="formerr" id="nomeerr"></div>
      </div>
      <div class="formrow">
        <label for="email">E-mail</label>
        <input id="email" data-cy="customer-email" name="email" type="email" required placeholder="voce@email.com">
        <div class="formerr" id="emailerr"></div>
      </div>
      <div class="formrow">
        <label for="cep">CEP</label>
        <input id="cep" data-cy="customer-cep" name="cep" inputmode="numeric" maxlength="9" required placeholder="00000-000">
        <div class="formerr" id="ceperr" data-cy="cep-error"></div>
      </div>
      <button class="checkout" data-cy="confirm-order" type="submit">Confirmar pedido · ${money(subtotal)}</button>
    </form>
  `
  document.getElementById('modalback').classList.add('show')
}

function formatCep(input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 8)
  input.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function finishOrder(event) {
  event.preventDefault()
  const cep = document.getElementById('cep').value.replace(/\D/g, '')

  if (cep.length !== 8) {
    document.getElementById('ceperr').textContent = 'Informe um CEP com 8 números.'
    return
  }

  const orderNumber = `VIVA-${Math.floor(10000 + Math.random() * 89999)}`
  cart = {}
  persistCart()
  document.getElementById('modal').innerHTML = `
    <div class="success" data-cy="order-confirmation">
      <div>🎉</div>
      <div class="eyebrow">Pedido confirmado</div>
      <h2>Obrigado pela compra!</h2>
      <p>Seu pedido <strong>${orderNumber}</strong> foi registrado nesta demonstração. Você receberia os próximos passos por e-mail.</p>
      <button class="cta" data-action="close-checkout">Voltar à loja</button>
    </div>
  `
}

function closeCheckout() {
  document.getElementById('modalback').classList.remove('show')
}

document.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]')
  if (!control) return

  const productId = Number(control.dataset.productId)
  switch (control.dataset.action) {
    case 'focus-search':
      document.getElementById('busca').focus()
      break
    case 'open-cart':
      openCart()
      break
    case 'close-cart':
      closeCart()
      break
    case 'scroll-to-shop':
      document.getElementById('loja').scrollIntoView({ behavior: 'smooth' })
      break
    case 'filter-category':
      setCategory(control.dataset.category)
      break
    case 'favorite': {
      const isFavorite = control.classList.toggle('liked')
      control.textContent = isFavorite ? '♥' : '♡'
      control.setAttribute('aria-pressed', String(isFavorite))
      break
    }
    case 'add-to-cart':
      addToCart(productId)
      break
    case 'increase-quantity':
      changeQuantity(productId, 1)
      break
    case 'decrease-quantity':
      changeQuantity(productId, -1)
      break
    case 'remove-item':
      removeFromCart(productId)
      break
    case 'checkout':
      showCheckout()
      break
    case 'close-checkout':
      closeCheckout()
      break
  }
})

document.getElementById('busca').addEventListener('input', renderProducts)
document.getElementById('ordem').addEventListener('change', renderProducts)
document.getElementById('modalback').addEventListener('click', (event) => {
  if (event.target.id === 'modalback') closeCheckout()
})
document.addEventListener('submit', (event) => {
  if (event.target.matches('[data-cy="checkout-form"]')) finishOrder(event)
})
document.addEventListener('input', (event) => {
  if (event.target.matches('[data-cy="customer-cep"]')) formatCep(event.target)
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart()
    closeCheckout()
  }
})

async function initializeStore() {
  const response = await fetch('/catalog.json')
  if (!response.ok) throw new Error('Não foi possível carregar o catálogo.')

  products = await response.json()
  categories = ['Todos', 'Novidades', ...new Set(products.map(({ category }) => category))]
  renderFilters()
  renderProducts()
  updateCart()
}

initializeStore().catch(() => {
  document.getElementById('products').innerHTML = '<div class="empty">Não foi possível carregar os produtos agora.</div>'
})
