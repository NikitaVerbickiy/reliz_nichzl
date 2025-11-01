class ShoppingCart
{
    constructor()
    {
        this.inems = {}
        this.total = 0
    }

    addItem(item)
    {
        if(this.items[item.title])
        {
            this.items[item.title].quantity += 1
        }
        else {
            this.items[item.title] = item
            this.items[item.title].quantity = 1
        }
        this.saveCartToCookies()
    }

    saveCartToCookies()
    {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    loadCartFromCookies()
    {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') 
        {
            this.items = JSON.parse(cartCookie);
        }
    }
}



// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
    let response = await fetch("baza.json")
    let products = await response.json()
    return products
};

function getCardHTML(product) {
    return `
        <div class="card" style="width: 18rem;">
        <img src="img/${product.img}(" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.direction}</p>
            <a href="#" class="btn btn-primary" data-product='${JSON.stringify(product)}'>Купити ${product.price} грн</a>
        </div>
        </div>
    `
}

function addToCart(event)
{
    // Отримуємо дані про товар з data-атрибута кнопки 
    const productData = event.target.getAttribute('data-product') 
    const product = JSON.parse(productData) // перетворюємо JSON у об’єкт 
    // Тут будемо додавати товар до кошика 
    cart.addItem(product)
}

// Викликаємо асинхронну функцію та очікуємо на отримання продуктів
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            // Відображаємо товари на сторінці
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
        button.addEventListener('click', addToCart)
    });
    }
})