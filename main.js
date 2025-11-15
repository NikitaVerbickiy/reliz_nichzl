// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
  // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
  let response = await fetch("baza.json");
  // Очікуємо на отримання та розпакування JSON-даних з відповіді
  let products = await response.json();
  // Повертаємо отримані продукти
  return products;
}

function swapStations() {
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
}

function toCash()
{
  window.location.href = "cart.html";
}

function getCardHTML(product) {
  return `<div class="card" style="width: 250px;">
  <img src="img/${product.img}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
    <p class="card-text">${product.direction}</p>
    <a href="#" class="btn btn-primary" data-product='${JSON.stringify(
      product
    )}'>${product.price} грн</a>
  </div>
</div>`;
}

class ShoppingCart {
  constructor() {
    this.items = {}; // об’єкт з товарами у кошику
    this.total = 0; // загальна вартість замовлення
  }


  addItem(item) {
    // Додавання товару до кошика
    if (this.items[item.title]) {
      this.items[item.title].quantity += 1;
    } else {
      this.items[item.title] = item;
      this.items[item.title].quantity = 1;
    }
    this.saveCartToCookies();
    console.log(this.items);
  }


  saveCartToCookies() {
    // збереження кошика у кукі
    let cartJSON = JSON.stringify(this.items);
    document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }


  loadCartFromCookies() {
    // Завантаження кошика з кукі
    let cartCookie = getCookieValue("cart");
    if (cartCookie && cartCookie !== "") {
      this.items = JSON.parse(cartCookie);
    }
  }
}
let cart = new ShoppingCart(); // Створення об'єкта кошика


function addToCart(event) {
  // Отримуємо дані про товар з data-атрибута кнопки
  const productData = event.target.getAttribute("data-product");
  const product = JSON.parse(productData); // перетворюємо JSON у об’єкт
  // Тут будемо додавати товар до кошика
  cart.addItem(product);
  event.preventDefault();
}


// Викликаємо асинхронну функцію та очікуємо на отримання продуктів
getProducts().then(function (products) {
  let productsList = document.querySelector(".products-list");
  if (productsList) {
    products.forEach(function (product) {
      // Відображаємо товари на сторінці
      productsList.innerHTML += getCardHTML(product);
    });
  }


  // Отримуємо всі кнопки "Купити" на сторінці
  let buyButtons = document.querySelectorAll(".products-list .btn-primary");
  // Навішуємо обробник подій на кожну кнопку "Купити"
  if (buyButtons) {
    buyButtons.forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  }
});

//Оформлення сторінки "Корзина"
let cart_list = document.querySelector(".cart-items-list");
function get_item(item) {
  return `<div class = "cart-item">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-quantity">Кількість: ${
                  item.quantity
                }</div>
                <div class="cart-item-price" data-price="${item.price}">${
    item.price * item.quantity
  } грн</div>
            </div>`;
}
function showCartList() {
  cart_list.innerHTML = "";
  for (let key in cart.items) {
    // проходимося по всіх ключах об'єкта cart.items
    cart_list.innerHTML += get_item(cart.items[key]);
  }
  cart_total.innerHTML = cart.calculateTotal();
}


showCartList();