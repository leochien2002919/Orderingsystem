const CART_KEY = "online_order_cart";

document.addEventListener("DOMContentLoaded", () => {
  renderOrder();
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
});

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
};

function renderOrder() {
  const cart    = loadCart();
  const ul      = document.getElementById("orderSummary");
  const totalEl = document.getElementById("orderTotal");
  let total     = 0;

  if (cart.length === 0) {
    ul.innerHTML = "<li>購物車是空的，請先選購商品。</li>";
    document.getElementById("placeOrderBtn").disabled = true;
    return;
  }

  ul.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} × ${item.quantity}  —  $${item.price*item.quantity}`;
    ul.appendChild(li);
    total += item.price * item.quantity;
  });
  totalEl.textContent = total;
}

function placeOrder() {
  const name  = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  if (!name || !phone) { alert("請填寫姓名及電話！"); return; }

  const cart   = loadCart();
  const total  = cart.reduce((s,i)=>s+i.price*i.quantity,0);
  const detail = cart.map(i=>`${i.name} ×${i.quantity}`).join("\n");

  alert(`✅ 訂單已送出！\n\n【顧客】${name}\n【電話】${phone}\n\n${detail}\n\n總金額：$${total}\n\n謝謝您的訂購！`);

  localStorage.removeItem(CART_KEY);
  window.location.href="index.html";
}
