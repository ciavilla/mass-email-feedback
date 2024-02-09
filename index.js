const api = require('./routes/authRoutes');
const morgan = require('morgan')
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cors = require('cors');

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());


// Import and use the routes
const authRoutes = require('./routes/authRoutes');
authRoutes(app);


const billingRoutes = require('./routes/billingRoutes');
billingRoutes(app);

// health endpoint
app.use('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is up and running' });
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    app.use(express.static('client/build'));

    // Express serves up index.html file
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT,  () => {console.log(`Listening: http://localhost:${PORT}`)});