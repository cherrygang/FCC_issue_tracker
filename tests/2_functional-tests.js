/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var should = chai.should;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          done();
        });
      });
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.isUndefined(res.body.assigned_to, 'No Assigned To')
          assert.isUndefined(res.body.status_text, 'No Status text')          
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            status_text: 'In QA'
        })
          .end(function(err,res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.name, 'ValidationError')
            assert.include(res.body.message, 'created_by')
            done();
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      //will need to replace the following every time collection is deleted
      let _id = "5d880458b9d3f511bb653c34"
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: _id
        })
          .end(function(err, res) {
            assert.equal(res.status,200)
            assert.equal(res.text, 'no updated fields sent')
            done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: _id,
            assigned_to: "jojo"
          })
          .end(function(err,res){
            assert.equal(res.status,200)
            assert.equal(res.text, 'updated successfully')
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: _id,
            assigned_to: "lol",
            issue_text: "99 issues and this ain't one"
          })
          .end(function(err, res) {
            assert.equal(res.status,200)
            assert.equal(res.text, 'updated successfully')
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({assigned_to: 'owl'})
          .end(function(err,res) {
            assert.equal(res.status,200);
            assert.property(res.body[0], 'assigned_to')
            assert.isArray(res.body)
            assert.equal(res.body[0].assigned_to, 'owl')
            done();
          })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({assigned_to: 'owl', open: true})
          .end(function(err, res) {
            assert.equal(res.status,200)
            assert.isArray(res.body)
            assert.equal(res.body[0].assigned_to, 'owl')
            assert.equal(res.body[0].open, true)
            done()
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status,200)
            assert.equal(res.text, '_id error')
            done()
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: '5d880458b9d3f511bb653c35'})
          .end(function(err, res) {
            assert.equal(res.status,200)
            assert.equal(res.text, 'deleted '+ '5d880458b9d3f511bb653c35')
            done()
          })
      });
      
    });

});
