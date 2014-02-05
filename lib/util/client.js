'use strict';

var unio    = require('unio'),
    request = require('request'),
    config  = require('./config'),

    defaultVersion = '0.1',
    cache   = {},

    patch   = function (/* Object */ options) {

        options = options || {};

        var auth = options.user && {
            user: options.user,
            pass: options.pass
        };

        return function (/* Object */ options, /* Function */ callback) {

            if (auth) {
                options.auth = auth;
            }

            return request(options, function (err, req, body) {

                // pass error to callback, or throw if no callback was passed in
                if (err) {
                    callback(err);
                }

                var parsed = null;

                // attempt to parse the string as JSON
                // if we fail, pass the callback the raw response body

                try {
                    parsed = JSON.parse(body);
                } catch (e) {
                    parsed = body;
                } finally {
                    callback(err, req, parsed);
                }

            });

        };

    };

module.exports = function(/* String */ options) {

    options = options || {};

    var version = options.version || defaultVersion,
        spec = config(version);

    if (cache[version]) {
        return cache[version];
    }

    if (spec) {

        cache[version] = unio({
            request: patch(options)
        });

        cache[version].specs = {}; // remove default spects

        cache[version]
            .spec(spec)
            .use(spec.name);

    }

    return cache[version];
};
