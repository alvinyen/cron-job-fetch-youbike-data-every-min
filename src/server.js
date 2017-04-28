const express = require('express');
let app = express();
const mongoose = require('mongoose');
const dbConnectionString = require('./config/config').dbConnectionString ;
const YoubikeStation = require('./models/youbike');
const cronYoubikeData = require('./utils/cronTools').cronYoubikeData ;



console.log(`dbConnectionString: ${dbConnectionString}`);
mongoose.connect(dbConnectionString);
const db = mongoose.connection;
// const IS_DB_CONNECTION_SUCCESS = require('./models/dbTools').IS_DB_CONNECTION_SUCCESS ;
let isDbConnectionSuccess = true ;

db.on('error', (err) => { 
    console.log('db connection failed!..', err); 
    isDbConnectionSuccess = false ;
    // app.set(IS_DB_CONNECTION_SUCCESS, isDbConnectionSuccess);
} );

db.once('open', () => { 
    // app.set(IS_DB_CONNECTION_SUCCESS, isDbConnectionSuccess);
    cronYoubikeData();
    YoubikeStation.collection.ensureIndex({ location: '2d' });
} );

app.listen(5000, () => {
    console.log(`server is running on port ${5000}`);
});