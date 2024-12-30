const API_URL = 'https://fakestoreapi.com';
let currentPage = 1;
const productsPerPage = 6;

async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        const categories = await response.json();
        const categorySelect = document.getElementById('productCategory');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        showMessage('Ошибка получения категорий: ' + error.message, 'error');
    }
}

async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products?limit=${productsPerPage}&page=${currentPage}`);
        if (!response.ok) throw new Error('Network response был не ок');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        showMessage('Ошибка получения товаров: ' + error.message, 'error');
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.price} ₽</p>
                    <button onclick="deleteProduct(${product.id})">Удалить товар</button>
                `;
        productList.appendChild(productElement);
    });
}

async function addProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('productTitle').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        category: document.getElementById('productCategory').value
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) throw new Error('Network response был не ок');
        const addedProduct = await response.json();
        showMessage('Товар успешно добавлен');
        getProducts();
    } catch (error) {
        showMessage('Ошибка добавления товара: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Network response был не ок');
        showMessage('Товар успешно удален');
        getProducts();
    } catch (error) {
        showMessage('Ошибка удаления товара: ' + error.message, 'error');
    }
}

function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
    setTimeout(() => messageElement.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    getCategories();
    getProducts();
});
