/**
 * Created by m1911 on 16-1-18.
 */
var settings = require('../setting'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Connection = require('mongodb').Connection;
module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe : true});