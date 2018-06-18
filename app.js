const app = require('express')();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Security = require('./lib/security');
//...

let Cart;

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/grubx',
    collection: 'sessions'
});

app.use(session({
    secret: 'Dis ish Secretish',
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: 'destroy',
    name: 'CartCheck',
}));

let checkCart = function (req,res,next){
    if (!req.session.cart) {
        req.session.cart = require('./lib/cart');
    }
    Cart = req.session.cart;
    next();
};
app.use(checkCart);

app.get('/', checkCart, function(req, res) {
    console.log(req.session);
    if (!req.session.cart) {
        req.session.cart = require('./lib/cart');
    }
    if(!req.session.test) {
        req.session.test = 'OK';
        res.send('OK');
    }
    else res.send('still OK');

});

app.post('/test', (req, res) => {
    let token = req.body.nonce;
    if(Security.isValidNonce(token, req)) {
        // OK
    } else {
        // Reject the request
    }
});



app.listen(3000, function () {
    console.log('Ecommerce sample listening on port 3000!');
});