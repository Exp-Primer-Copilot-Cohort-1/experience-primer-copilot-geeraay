// create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
// create database
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/comments');

// create model
var Comment = require('./commentModel');

// create router
var router = express.Router();
// use middleware to parse the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// use middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// create route
router.route('/comments')
    .post(function(req, res) {
        var comment = new Comment(req.body);
        comment.save();
        res.status(201).send(comment);
    })
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(comments);
            }
        });
    });

router.route('/comments/:commentId')
    .get(function(req, res) {
        Comment.findById(req.params.commentId, function(err, comment) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(comment);
            }
        });
    })
    .put(function(req, res) {
        Comment.findById(req.params.commentId, function(err, comment) {
            if (err) {
                res.status(500).send(err);
            } else {
                comment.author = req.body.author;
                comment.text = req.body.text;
                comment.save();
                res.json(comment);
            }
        });
    })
    .delete(function(req, res) {
        Comment.findByIdAndRemove(req.params.commentId, function(err, comment) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('removed');
            }
        });
    });

// register route
app.use('/api', router);

// start server
app.listen(3000, function() {
    console.log('server is running on port 3000');
});