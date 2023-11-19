var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public')); // set views to public folder
app.engine('html', require('ejs').renderFile); // set html to renderFile
app.set('view engine', 'html'); // set view engine to html

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];
let livros = ["Dom Casmurro"];
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    var initial = { author: 'Livraria Entrelinhas', message: 'Olá! Como posso ajudá-lo hoje leitor(a)?' }
    messages.push(initial);
    io.emit('send message', initial);
    socket.on('send message', data => {
        messages.push(data);
        io.emit('send message', data);

        if (data.message == 'desejo comprar um livro') {
            io.emit('send message', { author: 'Livraria Entrelinhas', message: `Que livro você deseja comprar, ${data.author}?` });
        } else if (livros.includes(data.message)) {
            io.emit('send message', { author: 'Livraria Entrelinhas', message: `O livro ${data.message} custa R$ 22,00 e você pode adquiri-lo em nosso site na aba "Clássicos"` });
        } else {
            io.emit('send message', { author: 'Livraria Entrelinhas', message: `Desculpe, não entendi. Pode reformular?` });
        }
    });

});

server.listen(3000);