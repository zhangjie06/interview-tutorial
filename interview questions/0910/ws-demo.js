// 引入express，搭建http服务
const express = require('express');
// 引入node原生http模块，ws库需要基于http server挂载
const http = require('http');
// 引入ws库，node端websocket实现
const WebSocket = require('ws');

// 创建express实例
const app = express();
// 基于express创建http服务
const server = http.createServer(app);
// 创建WebSocket服务实例，挂载到http server上
const wss = new WebSocket.Server({ server });
// ws服务端口
const port = 3001;

// 根路由返回前端页面
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<body>
  <h3>WebSocket 双向通信 Demo</h3>
  <!-- 消息展示区域 -->
  <div id="msg"></div>
  <!-- 输入框，输入发给服务端的消息 -->
  <input id="input" placeholder="输入消息发给服务器">
  <!-- 点击按钮发送消息 -->
  <button onclick="sendMsg()">发送</button>
  <script>
    // 获取dom元素
    const msgBox = document.getElementById('msg');
    const input = document.getElementById('input');

    // 创建websocket连接，ws协议，地址是服务端地址
    const ws = new WebSocket('ws://localhost:3001');

    // onopen：websocket握手成功，连接建立触发
    ws.onopen = () => {
      append("✅ WebSocket 连接成功");
    }

    // onmessage：收到服务端推送消息触发
    ws.onmessage = (e) => {
      append("收到服务端消息：" + e.data);
    }

    // onclose：连接关闭触发，WebSocket不会自动重连，需要手写
    ws.onclose = () => {
      append("❌ 连接关闭，需要自己写重连代码");
    }

    // onerror：连接发生错误触发
    ws.onerror = (err) => {
      append("错误：" + err);
    }

    // 发送消息函数，点击按钮调用
    function sendMsg() {
      // 获取输入框的值
      const val = input.value;
      // ws.send() 向服务端发送消息，支持文本/二进制
      ws.send(val);
      append("客户端发送：" + val);
      // 清空输入框
      input.value = '';
    }

    // 封装函数：往页面追加消息
    function append(text) {
      const div = document.createElement('div');
      div.innerText = text;
      msgBox.appendChild(div);
    }
  </script>
</body>
</html>
  `);
});

// wss.on('connection')：监听新客户端ws连接建立
wss.on('connection', (ws) => {
  console.log('新客户端接入WebSocket');
  // 服务端主动发消息给当前客户端
  ws.send('欢迎连接WebSocket服务');

  // ws.on('message')：监听客户端发来的消息
  ws.on('message', (data) => {
    console.log('收到客户端消息：', data);
    // 收到消息后，回复客户端
    ws.send(`服务端已收到：${data}`);
  });

  // ws.on('close')：客户端断开连接触发
  ws.on('close', () => {
    console.log('客户端断开ws连接');
  })
});

// http服务监听端口启动
server.listen(port, () => {
  console.log(`WS服务启动：http://localhost:${port}`);
});
