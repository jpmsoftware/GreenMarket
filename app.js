var express = require('express');
var ejs = require('ejs');
var app = express();
var PORT = process.env.PORT || 5000;
var routes = require('./routes');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});