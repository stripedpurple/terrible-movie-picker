let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;

let url = 'mongodb://localhost:27017';
let dbName = 'bad_movies';


/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'Bad Movie Picker'});
});

router.get('/api/v1/getmovies', (req, res, next) => {
    mongoClient.connect(url, (err, client) => {
        let db = client.db(dbName);
        let collection = db.collection('movies');

        collection.find({watched: false}).toArray((err, data) => {
            if (err || data.length < 1) {
                res.status(404).send();
            }else{
                res.send(data);
            }
            client.close();
        })
    })
});

router.post('/api/v1/addmovie', (req, res, next) => {
    mongoClient.connect(url, (err, client) => {
        let db = client.db(dbName);
        let collection = db.collection('movies');

        let newRecord = req.body;
        newRecord.watched = false;

        collection.insertOne(newRecord, (err, results) => {
            if (err || results.insertedCount < 1) {
                res.status(500).send();
            }else{
                res.status(200).send();
            }
            client.close();
        })
    })
});

router.post('/api/v1/watched', (req, res, next) => {
    mongoClient.connect(url, (err, client) => {
        let db = client.db(dbName);
        let collection = db.collection('movies');

        collection.update({"_id": ObjectID(req.body._id)}, {$set:{"watched": true}}, (err, results) => {
            if (err || results.insertedCount < 1) {
                res.status(500).send();
            }else{
                res.status(200).send();
            }
            client.close();
        })
    })
});


module.exports = router;
