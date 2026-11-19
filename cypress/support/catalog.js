const catalog = require('../../catalog.json')

const products = Object.fromEntries(catalog.map((product) => [product.key, product]))
const categories = [...new Set(catalog.map((product) => product.category))]

function formatPrice(amount) {
  return amount
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace(/\s+/gu, ' ')
    .trim()
}

function subtotalFor(productKeys) {
  return productKeys.reduce((total, key) => total + products[key].price, 0)
}

module.exports = { catalog, products, categories, formatPrice, subtotalFor }
