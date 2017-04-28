const fetch = require('node-fetch');
const youbikeDataApiAdd = require('./../../config/config').youbikeDataApiAdd ;

const YoubikeStation = require('./../../models/youbike');


const getYoubikeData = async () => {

    try {
        const bulk = YoubikeStation.collection.initializeOrderedBulkOp();
        const httpResponse = await fetch(youbikeDataApiAdd);
        if (await httpResponse.status != 200) {
            throw new Error(`${httpResponse.status(httpResponse.statusText)}`);
        }
        const result = await httpResponse.json();
        const dataObjects = result.retVal;
        const keys = Object.keys(dataObjects);
        // console.log(dataObjects);
        keys.forEach((key) => {
            const obj = dataObjects[key];
            const youbikeStation = new YoubikeStation();

            // console.log(`sno: ${obj.sno}`);
            youbikeStation.sno = obj.sno;
            // console.log(`youbikeStation.sno: ${youbikeStation.sno}`);

            // console.log(`sna: ${obj.sna}`);
            youbikeStation.sna = obj.sna;
            // console.log(`youbikeStation.sna: ${youbikeStation.sna}`);

            // console.log(`lat: ${obj.lat}`);
            // console.log(`lng: ${obj.lng}`);
            youbikeStation.location = [
                parseFloat(obj.lng),
                parseFloat(obj.lat)
            ];
            // console.log(`youbikeStation.location: ${youbikeStation.location}`);

            // console.log(`sbi: ${obj.sbi}`);
            youbikeStation.sbi = obj.sbi;
            // console.log(`youbikeStation.sbi: ${youbikeStation.sbi}`);

            bulk.find({ sno: obj.sno }).upsert().updateOne({
                $currentDate: {
                    lastModified: true
                    // ,
                    // "cancellation.date": { $type: "timestamp" }
                },
                $set: {
                    // sno: youbikeStation.sno,
                    // sna: youbikeStation.sna,
                    // location: youbikeStation.location,
                    sbi: youbikeStation.sbi
                },
                $setOnInsert: {
                    sno: youbikeStation.sno,
                    sna: youbikeStation.sna,
                    location: youbikeStation.location
                }
            });
        });


        await bulk.execute((err, result) => {
            if (err) {
                console.log('sth error..', err);
            } else {
                console.log(result.toJSON());
            }
        });

        // const result = await httpResponse.json()
        // return result ;
    } catch (e) {
        // zet get 
        // if (e !== BreakException) throw e;
        console.log(`something wrong...${e}`);
    }

};

module.exports = {
    getYoubikeData
}