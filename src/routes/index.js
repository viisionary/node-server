var express = require('express');
var router = express.Router();
import socketIOClient from 'socket.io-client';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
let io;

router.get('/socket', function () {
  io = socketIOClient('http://localhost:3000', {
    path: '/socket.io',
    transports: ['websocket'],
    query: {
      room: '1234567890',
    },
  });
  io.on('updates', data => {
    console.log('updates----', data)
  });
  io.on('connect', () => {
    console.log('websocket connected');
  });
  io.on('error', err => {
    console.log('websocket error', err);
  });
});
module.exports = router;
