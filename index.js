var alexa = require('alexa-traffic-rank'),//including alexa traffic rank node js module to get data from alexa.com
    mongoose = require('mongoose'); // including mongoose node js module to connect MongoDB
    mongoose.connect('mongodb://localhost:27017/test'); // this url should be your mongoDB url

var db = mongoose.connection, // Database connection object
    schema = mongoose.Schema({}, {collection: 'AlexaDailyTracks', strict: false, versionKey: false}); // Defining MongoDB Schema


// this code run if you fail to connect database
db.on('error', function(error) {
    console.error('connection error')
});
// this code run when you success fully connect to your mongodb database
db.once('open', function() {
    console.info('success connection to database');

    // This script will run once in 24 hour
    setInterval(function() {
        getDataAndSave();
    }, 1000*60*60*24);

    // uncomment this if you want to track your alexa rank Daily 3 time in a day
    /*setInterval(function() {
        getDataAndSave();
    }, 1000*60*60*8);*/
})

function getDataAndSave() {

    // enter site url that you want track alexa rank
    var url = 'panduboys.com';

    //using alexa-traffic-rank module function to get website data
    alexa.AlexaWebData(url, function(error, alexaData) {

        // if error not found than
        if(!error){

            // simply adding date and time to data that we got from alexa.com, so you can come to know when data is saved in your database
            alexaData.savedOn = Date.now();

            // uncomment in-case if you are tracking multiple site data than, i recommend add site url with alexa data, so you can understand which rank is belong to which website
            //  alexaData.siteUrl = url;

            // creating mongoose model
            var data = mongoose.model('AlexaDailyTracks', schema);

            // savig dta to data base
            data.create(alexaData, function (error, saved) {

                if(!error){
                    console.log(' Data Saved: '+saved.savedOn);
                }else{
                    console.log('data not saved: '+JSON.stringify(error)+' and your data is: '+JSON.stringify(alexaData));
                }
            });

        }else{
            // this code will run, when your script fail to get data from alexa.com
            console.error('can not get data from alexa.com: '+ JSON.stringify(error));
        }
    });
}