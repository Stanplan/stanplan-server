var mongoose = require('mongoose');

var mongoDB = `mongodb+srv://${process.env.DATABASE}:${process.env.DATABASE_ADMIN_PASSWORD}@stanplan-be1xm.mongodb.net/stanplan?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var database = mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB connection error:'));
