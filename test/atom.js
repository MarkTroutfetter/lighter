// Generated by CoffeeScript 1.4.0
(function() {
  var app, blog, credentials, express, fs, helper, path, request, util, xml2js;

  require('should');

  helper = (require('../modules/helper'))();

  xml2js = require('xml2js');

  util = require('util');

  path = require('path');

  fs = require('fs');

  express = require('express');

  request = require('supertest');

  app = express();

  blog = (require(__dirname + '/init')).blog;

  (require(path.join(__dirname, '../config')))(app);

  (require(path.join(__dirname, '../routes')))(app, blog.settings);

  credentials = util.format('%s:%s', blog.settings.username, blog.settings.password);

  describe('atom feed', function() {
    request = request(app);
    describe('POST /api/atom/feeds', function() {
      var id,
        _this = this;
      id = '';
      it('should return 401 for unauthorized request', function(done) {
        var post;
        post = request.post('/api/atom/feeds');
        return post.expect(401).end(function(err, res) {
          if (err !== null) {
            throw err;
          }
          return done();
        });
      });
      it('should return www authentication header for unauthorized request', function(done) {
        var post;
        post = request.post('/api/atom/feeds');
        return post.expect(401).end(function(err, res) {
          var wwwAuthHeader;
          if (err !== null) {
            throw err;
          }
          wwwAuthHeader = res.headers['WWW-Authenticate'.toLowerCase()];
          wwwAuthHeader.should.be.ok;
          wwwAuthHeader.indexOf('Basic').should.equal(0);
          return done();
        });
      });
      it('should return expceted resultset and statuscode', function(done) {
        var post;
        post = request.post('/api/atom/feeds');
        post.set('Content-Type', 'application/atom+xml');
        post.set('authorization', util.format('Basic %s', new Buffer(credentials).toString('base64')));
        return fs.readFile(__dirname + '/post.xml', 'utf8', function(err, result) {
          post.write(result);
          return post.expect(201).end(function(err, res) {
            var parser;
            if (err !== null) {
              throw err;
            }
            parser = new xml2js.Parser();
            parser.parseString(res.text, function(err, result) {
              var lastIndex;
              result.entry.title[0].should.be.ok;
              result.entry.content[0].should.be.ok;
              result.entry.id[0].should.be.ok;
              lastIndex = result.entry.id[0].lastIndexOf('/') + 1;
              return id = result.entry.id[0].substr(lastIndex);
            });
            return done();
          });
        });
      });
      return afterEach(function(done) {
        return blog.deletePost(id, function() {
          return done();
        });
      });
    });
    describe('PUT /api/atom/entries/:id', function() {
      var expected, id,
        _this = this;
      id = '';
      expected = 'test post';
      before(function(done) {
        var promise,
          _this = this;
        promise = blog.createPost({
          title: expected,
          author: 'Mehfuz Hossain',
          body: 'Empty body'
        });
        return promise.then(function(result) {
          id = result._id;
          return done();
        });
      });
      it('should return 401 for unauthorized request', function(done) {
        var req;
        req = request.put(util.format('/api/atom/entries/%s', id));
        return req.expect(401).end(function(err, res) {
          if (err !== null) {
            throw err;
          }
          return done();
        });
      });
      it('should update post return correct status code when authorized', function(done) {
        var req;
        req = request.put(util.format('/api/atom/entries/%s', id));
        req.set('Content-Type', 'application/atom+xml');
        req.set('authorization', util.format('Basic %s', new Buffer(credentials).toString('base64')));
        return fs.readFile(__dirname + '/post.xml', 'utf8', function(err, result) {
          req.write(result);
          return req.expect(200).end(function(err, res) {
            var parser;
            if (err !== null) {
              throw err;
            }
            parser = new xml2js.Parser();
            parser.parseString(res.text, function(err, result) {
              result.entry.title[0].should.be.ok;
              result.entry.content[0]._.length.should.not.equal(0);
              return result.entry.id[0].should.be.ok;
            });
            return done();
          });
        });
      });
      return after(function(done) {
        return blog.deletePost(id, function() {
          return done();
        });
      });
    });
    return describe('DELETE /api/atom/entries/:id', function() {
      var expected, id;
      expected = 'test post';
      id = '';
      before(function(done) {
        var promise,
          _this = this;
        promise = blog.createPost({
          title: expected,
          author: 'Mehfuz Hossain',
          body: 'Empty body'
        });
        return promise.then(function(result) {
          id = result._id;
          return done();
        });
      });
      it('should return 401 for unauthorized request', function(done) {
        var req;
        req = request.del(util.format('/api/atom/entries/%s', id));
        return req.expect(401).end(function(err, res) {
          if (err !== null) {
            throw err;
          }
          return done();
        });
      });
      return it('should return expected for authorized request', function(done) {
        var req;
        req = request.del(util.format('/api/atom/entries/%s', id));
        req = req.set('authorization', util.format('Basic %s', new Buffer(credentials).toString('base64')));
        return req.expect(200).end(function(err, res) {
          if (err !== null) {
            throw err;
          }
          return done();
        });
      });
    });
  });

}).call(this);
