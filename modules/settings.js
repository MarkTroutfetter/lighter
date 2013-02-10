// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = function(app) {
    var Settings;
    Settings = (function() {

      function Settings(app) {
        this.url = __bind(this.url, this);

        var url;
        this.mongoose = require('mongoose');
        url = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/lighter';
        this.mongoose.connect(url);
        this.marked = require('marked');
        this.marked.setOptions({
          highlight: function(code, lang) {
            var hl;
            hl = require('highlight.js');
            hl.tabReplace = '    ';
            return (hl.highlightAuto(code)).value;
          }
        });
      }

      Settings.prototype.marked = Settings.marked;

      Settings.prototype.mongoose = Settings.mongoose;

      Settings.prototype.url = function() {
        return app.host || 'http://localhost/';
      };

      Settings.prototype.title = process.env.BLOG_TITLE || 'Mehfuz\'s Blog';

      Settings.prototype.username = process.env.USERNAME || 'admin';

      Settings.prototype.password = process.env.PASSWORD || 'admin';

      Settings.prototype.updated = new Date();

      Settings.prototype.engine = 'Lighter Blog Engine';

      Settings.prototype.format = function(content) {
        return this.marked(content);
      };

      return Settings;

    })();
    return new Settings();
  };

}).call(this);
