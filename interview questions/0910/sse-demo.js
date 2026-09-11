// 引入express框架，用于快速搭建web服务
const express = require('express');
// 创建express实例
const app = express();
// 定义服务端口号
const port = 3000;

// 路由：访问根路径 / 返回前端页面
app.get('/', (req, res) => {
  // send返回html字符串给浏览器
  res.send(`
<!DOCTYPE html>
<html>
<body>
  <h3>SSE 客户端（服务器单向推送）</h3>
  <!-- 用来展示收到的消息 -->
  <div id="msg"></div>
  <script>
    // 获取页面消息容器dom
    const msgBox = document.getElementById('msg');
    // 创建SSE连接，请求后端的/sse-stream接口
    // EventSource是浏览器原生API，专门用于SSE
    const source = new EventSource('/sse-stream');

    // onmessage：监听后端发送的默认data消息
    source.onmessage = function(e) {
      // 创建一个div元素，放消息
      const div = document.createElement('div');
      // e.data 就是后端传来的数据
      div.innerText = "收到SSE消息：" + e.data;
      // 添加到页面容器
      msgBox.appendChild(div);
    }

    // addEventListener：监听自定义事件 notice
    // 后端通过 event:notice 定义事件名，前端用这个方法接收
    source.addEventListener('notice', function(e) {
      const div = document.createElement('div');
      div.style.color = 'red';
      div.innerText = "【通知事件】" + e.data;
      msgBox.appendChild(div);
    })

    // onerror：连接出错/断开触发，浏览器会自动重试连接
    source.onerror = function(err) {
      console.error('SSE error', err);
    }
  </script>
</body>
</html>
  `);
});

// SSE流接口，建立长连接，持续推送数据
app.get('/sse-stream', (req, res) => {
  // SSE必须设置响应头：告诉浏览器这是事件流
  res.setHeader('Content-Type', 'text/event-stream');
  // 禁止缓存，否则浏览器缓存消息，无法实时接收
  res.setHeader('Cache-Control', 'no-cache');
  // 保持长连接
  res.setHeader('Connection', 'keep-alive');

  // 定时器：每1秒推送一条普通消息
  const timer1 = setInterval(() => {
    // SSE消息格式：data:内容 + 两个换行 \n\n 代表一条消息结束
    res.write(`data: 服务器时间 ${new Date().toLocaleString()}\n\n`);
  }, 1000);

  // 定时器：每3秒推送自定义事件 notice
  const timer2 = setInterval(() => {
    // event:xxx 定义事件名称，前端用addEventListener监听
    res.write(`event: notice\n`);
    // 消息内容，末尾必须两个换行
    res.write(`data: 系统定时提醒\n\n`);
  }, 3000);

  // req.on('close')：客户端关闭页面/断开连接时触发
  req.on('close', () => {
    // 清除定时器，防止后台无限循环推送，内存泄漏
    clearInterval(timer1);
    clearInterval(timer2);
    console.log('SSE客户端断开连接');
  })
});

// 启动服务，监听端口
app.listen(port, () => {
  console.log(`SSE服务启动：http://localhost:${port}`);
});
