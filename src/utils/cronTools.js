const CronJob = require('cron').CronJob;
const getYoubikeData = require('./getRemoteData/tools').getYoubikeData ;
const fetch = require('node-fetch');

const cronYoubikeData = () => {
    // console.log('cron job');
    new CronJob('*/1 * * * *', () => {
        console.log( new Date() );
        getYoubikeData() ;
    }, null, true);
} ;

const cronHerokuAvoidIdleEvery5Min = async () => {
    new CronJob('*/5 * * * *', () => {
        console.log( new Date() );
        try{
            const httpResponse = await fetch('https://find-near-me.herokuapp.com/v1/ubike-station/taipei?lat=25.015777&lng=121.565478');
            console.log(await httpResponse.json());
        }catch(e){
            console.log(`something wrong in cron heroku every 5 min...： ${e}`);
        }
    }, null, true);
} ;

module.exports = {
    cronYoubikeData,
    cronHerokuAvoidIdleEvery5Min
} ;