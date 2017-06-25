const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Vehicle = require('./app/models/vehicle');

// configure app for bodyParser()
// lets us grab data from the body of POST

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set up port for server to listen on
const port = process.env.PORT || 3000;

// connect to database
mongoose.connect('mongodb://localhost:27017/codealong');

// API routes
const router = express.Router();

// routes will all be prefixed with /api
app.use('/api', router);

// MIDDLEWARE
// middleware can be very useful for doing validaitons. We can log things from here or stop
// the request from continuing in the event that the request is not safe.

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('...there is some processing currently going on...');
    next();
});


// test routes
router.get('/', function(req, res) {
    res.json({message: 'Welcome to our API!'});
});

router.route('/vehicles')
    .post(function(req, res) {
        const vehicle = new Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;

        vehicle.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Vehicle was successfully manufactured'});
        });
    })
    .get(function(req, res) {
        Vehicle.find(function(err, vehicles) {
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });

router.route('/vehicle/:vehicle_id')
    .get(function(req, res) {
        Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
            if (err) {
                res.send(err);
            }
            res.json(vehicle);
        });
    });

router.route('/vehicle/make/:make')
    .get(function(req, res) {
        Vehicle.find({make: req.params.make}, function(err, vehicle) {
            if (err) {
                res.send(err);
            }
            res.send(vehicle);
        });
    });

    router.route('/vehicle/color/:color')
        .get(function(req, res) {
            Vehicle.find({color: req.params.color}, function(err, vehicle) {
                if (err) {
                    res.send(err);
                }
                res.send(vehicle);
            });
        });

// fire up our server
app.listen(port);

// print message to console when server starts
console.log(`Server listening on ${port}`);