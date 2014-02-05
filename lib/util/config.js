'use strict';

var parser         = require('json5'),
    defaultConfig  = __dirname + '/../../config',
    cache          = {};

module.exports = function(/* String */ version) {

    if (!version) {
        return;
    }

    var base = defaultConfig + '/' + version,
        resources;

    if (!cache[version]) {

        cache[version] = require('konphyg')({
            basePath: base,
            parser: parser
        })('common');

        resources = require('konphyg')({
            basePath: base + '/resources',
            parser: parser
        }).all();

        cache[version].resources = [];

        Object.keys(resources).forEach(function(key) {

            var value = resources[key];

            value = typeof value === 'object' && (value instanceof Array) ? value : [value];
            cache[version].resources.push.apply(cache[version].resources, value);

        });

        cache[version].resources.forEach(function (resource) {
            resource.params = resource.params || {};
        });

    }

    try {
        return cache[version];
    } catch (e) {
        return null;
    }

};
