/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB; 
mongoose.connect(CONNECTION_STRING,{useNewUrlParser: true})


const issueSchema = mongoose.Schema
const issueModel = new issueSchema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: ""},
  status_text: {type: String, default: ""},
  created_on: String,
  updated_on: [String],
  open: Boolean
})
var issue = mongoose.model('issue', issueModel)

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      issue.find(req.query, function (err, data) {
        if (err) {res.send(err)}
        else {res.send(data)}
      })
      //res.send('testinggggg')
      
    })
  
    .post(function (req, res){
      var project = req.params.project;
      var issue_title = req.body.issue_title
      var issue_text = req.body.issue_text
      var created_by = req.body.created_by
      var assigned_to = req.body.assigned_to
      var status_text = req.body.status_text
      var created_on = new Date()
      var test = new issue({
        issue_title: issue_title, issue_text:issue_text, created_by: created_by, assigned_to: assigned_to, status_text: status_text, open: true, created_on: created_on, updated_on: created_on
      })
      test.save(function(err,data) {
                if (err) {
                  res.json(err)}
                else {
                  res.json({_id: data._id, issue_title: issue_title, issue_text: issue_text, created_by: created_by, assigned_to: assigned_to, status_text: status_text, open: true, created_on: created_on, updated_on: created_on})
                }
                })
       
    })

    .put(function (req, res){
      var project = req.params.project;
    //remove fields that weren't updated
      let cleanup = req.body
      for (var objects in cleanup) {
        if (cleanup[objects] == "") {
          delete cleanup[objects]
        }
      }

    //add updated on + save log
      var datetoadd = new Date()
      issue.findById(req.body._id, function (err, data) {
        if (err) {
          res.send('could not update '+ req.body._id)
        }
        else {
          data.updated_on.push(datetoadd)
          var counter = 0
          for (var objects in cleanup) {
            counter+=1
            data[objects] = cleanup[objects]
          }
          data.save(function(err,savedreturn) {
            if (err) {
              res.json(err)
            }
            else {
              if (counter < 2) {
                res.send('no updated fields sent')
              }
              else {
                res.send('updated successfully')
              }
            }
          })
        }
      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if (req.body._id== undefined) {res.send('_id error')}
      else{
        issue.findOneAndDelete({_id: req.body._id}, function(err, data){
          if (err) {res.send('could not delete '+ req.body._id)}
          else {res.send('deleted '+req.body._id)}
        })
      }

    });
    
};
