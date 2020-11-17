'use strict'

// Put this plugin's name before all the rcpt_to plugins in the config/plugins file.

const Address = require('../haraka-necessary-helper-plugins/address-rfc2821').Address;

var SRS = require("./srs.js");
var rewriter;

exports.register = function () {
  this.inherits('queue/discard');

  this.load_batv_ini();
  
  this.register_hook('data_post', 'relay');
  this.register_hook('rcpt', 'rcpt');
}

exports.load_batv_ini = function () {
  const plugin = this;

  plugin.cfg = plugin.config.get('batv.ini',
  function () {
    plugin.load_batv_ini()
  });

  var maxAgeSeconds = 21 * 24 * 60 * 60; // default: 21 days 
  if(plugin.cfg.srs.maxAgeSeconds) maxAgeSeconds = plugin.cfg.srs.maxAgeSeconds;
  else if(plugin.cfg.srs.maxAgeDays) maxAgeSeconds = plugin.cfg.srs.maxAgeDays * 24 * 60 * 60;

  rewriter = new SRS({
    secret: plugin.cfg.srs.secret,
    maxAge: maxAgeSeconds
  });
}

exports.rcpt = function (next, connection, params) { // Check the rcpt and decide if it is spam or not.
  var txn = connection.transaction;
  const plugin = this;
  if(!connection.relaying && txn.mail_from.isNull()) { // Incoming
    var oldUser = txn.rcpt_to[0].user;
    var reversed = rewriter.reverse(oldUser);
    
    if(reversed === null || reversed === undefined) {
      connection.logdebug(plugin, "marking " + txn.rcpt_to + " for drop");
      connection.transaction.notes.discard = true;
    }
    else {
      txn.rcpt_to.pop();
      var sendTo = reversed[0] + "@" + reversed[1];
      txn.rcpt_to.push(new Address(`<${sendTo}>`));
    }
  }

  next();
}

exports.relay = function (next, connection) { // Change the sender address of outgoing e-mails.
  var txn = connection.transaction;
  if (connection.relaying) {    
    var oldMailFrom = txn.mail_from;
    var rewritten = rewriter.rewrite(oldMailFrom.user, oldMailFrom.host);
    var newMail = new Address(`<${rewritten}@${oldMailFrom.host}>`);

    txn.mail_from = newMail;
  }

  next();
}
