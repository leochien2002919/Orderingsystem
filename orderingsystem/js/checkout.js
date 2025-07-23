function placeOrder() {
  const name  = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  if (!name || !phone) { alert("請填寫姓名及電話！"); return; }

  const cart = loadCart();
  if (cart.length === 0) { alert("購物車是空的！"); return; }

  // TODO: 這裡請根據你的登入狀態取得 user_id
  const user_id = 1; // 範例寫死，請改成實際登入用戶的 id

  // 組成 items 陣列
  const items = cart.map(item => ({
    product_id: item.id, // 請確認 cart 裡有 id 屬性
    quantity: item.quantity
  }));

  fetch('http://localhost:3001/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, items })
  })
    .then(res => res.json())
    .then(data => {
      if (data.order_id) {
        alert(`✅ 訂單已送出！\n訂單編號：${data.order_id}\n謝謝您的訂購！`);
        localStorage.removeItem(CART_KEY);
        window.location.href = "index.html";
      } else {
        alert('下單失敗：' + (data.error || '未知錯誤'));
      }
    })
    .catch(err => {
      alert('下單失敗：' + err.message);
    });
}