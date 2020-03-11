// require packages for express server
require('dotenv').config();
let cors = require('cors');
let express = require('express');
let expressJwt = require('express-jwt');
let morgan = require('morgan');
let rowdyLogger = require('rowdy-logger');

// instantiate teh app
let app = express();
let rowdyResults = rowdyLogger.begin(app);

// middleware declerations
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ROUTES
app.get('/', function(req, res) {
    res.send("Looks like we made it ☀️");
})

app.use('/auth', expressJwt({
    secret: "yoursecretmessage" // TODO: update to env variable
}).unless({
    path: [
        { url: '/auth/login', methods: ['POST'] },
        { url: '/auth/signup', methods: ['POST'] }
    ]
}), require('./controllers/auth'))

app.get('*', function(req, res) {
    res.status(404).send({ message: 'NOOOOOOO WRONG PAGE 💃' });
})

// Listen on ze port
app.listen(8000, function() {
    console.log("🐳");
    rowdyResults.print();
})