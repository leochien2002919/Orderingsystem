// filepath: c:\Users\AA\Documents\GitHub\Orderingsystem\orderingsystem\js\login.js
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('http://localhost:3001/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user && data.user.id) {
        localStorage.setItem('user_id', data.user.id); // 關鍵：存 user_id
        alert('登入成功！');
        window.location.href = 'member.html'; // 導向會員中心
      } else {
        alert(data.message || '登入失敗');
      }
    })
    .catch(err => {
      alert('登入失敗：' + err.message);
    });
}

// 綁定登入按鈕
document.getElementById('loginBtn').addEventListener('click', login);