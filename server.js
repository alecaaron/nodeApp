let Express = require('express');
let App = Express();
let _http = require('http').Server(App);
let io = require('socket.io')(_http);
let mongoose = require('mongoose');
let BodyParser = require('body-parser');

App.use(Express.static(__dirname));
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({extended:false}));

let dbUrl = 'mongodb://admin:password@ds147668.mlab.com:47668/nodechatapp';

let Message = mongoose.model('message', {
  name: String,
  message: String
})

App.get('/messages', (req,res) => {
    Message.find({},(err, messages)=>{
      res.send(messages);
    });
});

App.post('/messages', (req,res) =>{
  let message = new Message(req.body);

  message.save((err)=>{
    if(err){
      sendStatus(500);
    }else{
      io.emit('message', req.body);
      res.sendStatus(200);
    }
  });
});

io.on('connection', socket =>{
  console.log('A new user connected');
});

mongoose.connect(dbUrl, err =>{
  console.log('mongodb connected', err)
});

const Server = _http.listen(process.env.PORT || 3000, () => {
  console.log('Server is on port', Server.address().port)
});
