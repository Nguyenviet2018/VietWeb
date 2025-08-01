const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Lấy IP từ request
function getClientIP(socket) {
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    return ip.replace('::ffff:', ''); // bỏ prefix IPv6
}
//////////////////thêm ngày giờ//////////
const now = new Date();

const day = now.getDate().toString().padStart(2, '0');
const month = (now.getMonth() + 1).toString().padStart(2, '0'); // tháng bắt đầu từ 0
const year = now.getFullYear();

const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');

const datetime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

console.log("Ngày giờ hiện tại định dạng:", datetime);

///////////////////////
io.on('connection', socket => {
    //socket là biến đại diện client kết nối đến
    const clientIP = getClientIP(socket);
    console.log(` Người dùng kết nối từ IP: ${clientIP}`);
    // Gửi thông báo IP mới tham gia đến tất cả client
    //io.emit('chat message', `🔔 Người dùng từ IP ${clientIP} đã tham gia trò chuyện: ${datetime}.`);
io.emit('chat message', `🔔 Người dùng từ IP ${clientIP} -> ${datetime}.`);
    // Nhận tin nhắn từ client
    socket.on('chat message', (msg) => {
        io.emit('chat message', `💬 ${clientIP}: ${msg}`);
    });
    socket.on('disconnect', () => {
        console.log(`IP ${clientIP} đã ngắt kết nối`);
        io.emit('chat message', ` Người dùng từ IP ${clientIP} đã thoát.`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(` Server đang chạy tại http://localhost:${PORT}`);
    console.log(` Chương trình server`);
    console.log(`Nguyễn Quốc Việt`);
});
