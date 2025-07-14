/* ========= 資料 ========= */
const categories = ["主餐", "小菜", "飲料"];

const menu = {
  主餐: [
    { name: "牛肉飯",   price: 120 },
    { name: "豬排蓋飯", price: 130 },
    { name: "唐揚雞丼", price: 125 },
    { name: "咖哩雞飯", price: 110 },
    { name: "燒鯖魚定食", price: 140 },
    { name: "叉燒拉麵",   price: 150 }
  ],
  小菜: [
    { name: "滷蛋",     price: 20 },
    { name: "豆干",     price: 25 },
    { name: "海帶絲",   price: 30 },
    { name: "炸春捲",   price: 35 },
    { name: "溫泉蛋",   price: 28 },
    { name: "炸豆腐",   price: 32 }
  ],
  飲料: [
    { name: "紅茶",       price: 30 },
    { name: "奶茶",       price: 35 },
    { name: "綠茶",       price: 28 },
    { name: "可樂",       price: 32 },
    { name: "蜂蜜檸檬",   price: 38 },
    { name: "柳橙汁",     price: 40 }
  ]
};

/* ========= 狀態 ========= */
let currentCategory = categories[0];
let currentSort     = "default";   // default | asc | desc
let searchKeyword   = "";
let cart            = [];

/* ========= localStorage ========= */
const CART_KEY = "online_order_cart";

function saveCart () {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function loadCart () {
  const saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try { cart = JSON.parse(saved); } catch { cart = []; }
  }
}

/* ========= 初始化 ========= */
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  loadCart();
  renderCart();
  renderMenu();
  bindControls();
});

/* ========= 分類 ========= */
function renderCategories () {
  const ul = document.getElementById("categoryList");
  ul.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    if (cat === currentCategory) li.classList.add("active");
    li.onclick = () => {
      currentCategory = cat;
      currentSort = "default";
      searchKeyword = "";
      document.getElementById("searchInput").value = "";
      updateSortButtons();
      renderCategories();
      renderMenu();
    };
    ul.appendChild(li);
  });
}

/* ========= 菜單 ========= */
function renderMenu () {
  const menuList  = document.getElementById("menuList");
  const menuTitle = document.getElementById("menuTitle");
  menuTitle.textContent = `${currentCategory} 菜單`;

  // 篩選
  let items = menu[currentCategory].filter(item =>
    item.name.includes(searchKeyword)
  );

  // 排序
  if (currentSort === "asc")      items.sort((a, b) => a.price - b.price);
  else if (currentSort === "desc")items.sort((a, b) => b.price - a.price);

  // 渲染
  menuList.innerHTML = "";
  items.forEach(item => {
    const div   = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>$${item.price}</p>
      <button onclick="addToCart('${item.name}', ${item.price})">加入購物車</button>
    `;
    menuList.appendChild(div);
  });
}

/* ========= 購物車 ========= */
function renderCart () {
  const ul      = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalAmount");
  ul.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    ul.innerHTML = "<li>目前購物車是空的。</li>";
  } else {
    cart.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - $${item.price} x ${item.quantity}
        <div class="cart-buttons">
          <button onclick="changeQuantity('${item.name}', -1)">－</button>
          <button onclick="changeQuantity('${item.name}', 1)">＋</button>
          <button onclick="removeFromCart('${item.name}')">刪除</button>
        </div>
      `;
      ul.appendChild(li);
      total += item.price * item.quantity;
    });
  }
  totalEl.textContent = total;
  saveCart();
}

function addToCart (name, price) {
  const existing = cart.find(i => i.name === name);
  existing ? existing.quantity++ : cart.push({ name, price, quantity: 1 });
  renderCart();
}
function changeQuantity (name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
  renderCart();
}
function removeFromCart (name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
}
function clearCart () {
  cart = [];
  renderCart();
}

/* ========= 控制 ========= */
function bindControls () {
  // 搜尋
  document.getElementById("searchInput").addEventListener("input", e => {
    searchKeyword = e.target.value.trim();
    renderMenu();
  });

  // 排序
  document.getElementById("sortDefaultBtn").onclick = () => {
    currentSort = "default";
    updateSortButtons();
    renderMenu();
  };
  document.getElementById("sortAscBtn").onclick = () => {
    currentSort = "asc";
    updateSortButtons();
    renderMenu();
  };
  document.getElementById("sortDescBtn").onclick = () => {
    currentSort = "desc";
    updateSortButtons();
    renderMenu();
  };

  // 結帳
  document.getElementById("checkoutBtn").onclick = () => {
    if (cart.length === 0) {
      alert("購物車是空的！");
      return;
    }
    const summary = cart.map(i => `${i.name} x${i.quantity}`).join("\n");
    alert(`🧾 訂單內容：\n${summary}\n\n總金額：$${cart.reduce((a,b)=>a+b.price*b.quantity,0)}`);
  };

  // 清空
  document.getElementById("clearCartBtn").onclick = () => {
    if (cart.length === 0) return;
    if (confirm("確定要清空購物車嗎？")) clearCart();
  };
}

function updateSortButtons () {
  document.querySelectorAll(".sort-buttons button")
          .forEach(btn => btn.classList.remove("active"));
  if (currentSort === "asc")
    document.getElementById("sortAscBtn").classList.add("active");
  else if (currentSort === "desc")
    document.getElementById("sortDescBtn").classList.add("active");
  else
    document.getElementById("sortDefaultBtn").classList.add("active");
}
