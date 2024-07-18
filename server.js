const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root@123',
    database: 'orders_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Serve the order form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'customer.html'));
});

// Serve the admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'admin.html'));
});

app.post('/order', (req, res) => {
    const { name, email, product } = req.body;

    let sql = 'INSERT INTO orders (name, email, product) VALUES (?, ?, ?)';
    db.query(sql, [name, email, product], (err, result) => {
        if (err) {
            res.status(500).send('Error saving order');
            throw err;
        }

        io.emit('newOrder', { name, email, product });
        res.json({ message: 'Order placed successfully' });
    });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
