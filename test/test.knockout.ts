/// <reference path="../_definitions.d.ts" />

import _ = require("underscore");
import ko = require("knockout");
import ko_ = require("kounderscore");

describe("Knockout.js Underscore.js integrations", () => {

    describe("ko.observableArray", () => {

        it("should contain underscore.js methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6));

            Object.keys(ko_.collections).forEach(method => {
                obsArray[method].should.be.a.Function;
            });
        });

        it("should return plain value when using direct methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6));

            var filtered = obsArray.filter(num => num % 2 === 0);

            filtered.should.be.an.Array;
            filtered.length.should.equal(2);
        });

        it("should return computed value when using 'underscored' methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6));

            var filtered = obsArray._filter(num => num % 2 === 0);

            ko.isComputed(filtered).should.be.ok;

            filtered().should.be.an.Array;
            filtered().length.should.equal(2);
        });

        it("should maintain computed result in sync with source observableArray", () => {
            var obsArray = ko.observableArray(_.range(1, 6));

            var filtered = obsArray._filter(num => num % 2 === 0);

            ko.isComputed(filtered).should.be.ok;

            filtered().should.be.an.Array;
            filtered().length.should.equal(2);

            obsArray.push(6, 7, 8);

            filtered().length.should.equal(4);
        });

    });

    describe("addToSubscribable method", () => {

        it("should add collections methods to any subscribable", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            (!computedArray.filter).should.be.ok;

            ko_.addToSubscribable(computedArray);

            Object.keys(ko_.collections).forEach(method => {
                computedArray[method].should.be.a.Function;
            });
        });

        it("should return plain value when using direct methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            ko_.addToSubscribable(computedArray);

            var filtered = computedArray.filter(num => num % 2 === 0);

            filtered.should.be.an.Array;
            filtered.length.should.equal(2);
        });

        it("should return synced computed value when using 'underscored' methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            ko_.addToSubscribable(computedArray);

            var filtered = computedArray._filter(num => num % 2 === 0);

            ko.isComputed(filtered).should.be.ok;

            filtered().should.be.an.Array;
            filtered().length.should.equal(2);

            obsArray.push(6, 7, 8);

            filtered().length.should.equal(4);
        });

    });

    describe("addToPrototype method", () => {
        var oldFn = _.clone(ko.observable.fn);
        afterEach(() => ko.observable.fn = _.clone(oldFn));

        it("should add all collection methods to given object", () => {
            var proto = {};
            ko_.addToPrototype(proto);

            Object.keys(ko_.collections).forEach(method => {
                proto[method].should.be.a.Function;
            });
        });

    });
});
