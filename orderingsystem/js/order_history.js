const user_id = localStorage.getItem('user_id'); // 從 localStorage 取得登入用戶 id

function fetchOrderHistory() {
  if (!user_id) {
    alert('請先登入！');
    // 可選擇導向登入頁，例如：
    // window.location.href = 'login.html';
    return;
  }

  fetch(`http://localhost:3001/api/orders/user/${user_id}`)
    .then(res => res.json())
    .then(orders => {
      const list = document.getElementById('orderHistoryList');
      list.innerHTML = '';
      if (!orders || orders.length === 0) {
        list.innerHTML = '<li>尚無歷史訂單</li>';
        return;
      }
      orders.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `訂單編號：${order.id}，建立時間：${order.created_at}`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      alert('查詢訂單失敗：' + err.message);
    });
}

document.addEventListener('DOMContentLoaded', fetchOrderHistory);