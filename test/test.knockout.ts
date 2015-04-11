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
            var obsArray = ko.observableArray(_.range(1, 6)),
                filtered = obsArray._filter(num => num % 2 === 0);

            ko.isComputed(filtered).should.be.ok;

            filtered().should.be.an.Array;
            filtered().length.should.equal(2);
        });

        describe("computed result", () => {

            it("should stay in sync with source", () => {
                var obsArray = ko.observableArray(_.range(1, 6)),
                    filtered = obsArray._filter(num => num % 2 === 0);

                ko.isComputed(filtered).should.be.ok;

                filtered().should.be.an.Array;
                filtered().length.should.equal(2);

                obsArray.push(6, 7, 8);

                filtered().length.should.equal(4);
            });

            it("should contain underscore collection methods", () => {
                var obsArray = ko.observableArray(_.range(1, 6)),
                    filtered = obsArray._filter(num => num % 2 === 0);

                Object.keys(ko_.collections).forEach(method => {
                    filtered[method].should.be.a.Function;
                });
            });

            it("should stay in sync even if recursive", () => {
                var obsArray = ko.observableArray(_.range(1, 6)),
                    filtered = obsArray._filter(num => num % 2 === 0),
                    mapped = filtered._map(num => num * 2);

                mapped().should.be.an.Array;
                mapped().length.should.equal(2);

                obsArray.push(6, 7, 8);

                mapped().length.should.equal(4);
                mapped()[0].should.equal(4);
            });

        });

    });

    describe("addTo method", () => {

        it("should add collections methods to any subscribable", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            (!computedArray.filter).should.be.ok;

            ko_.addTo(computedArray);

            Object.keys(ko_.collections).forEach(method => {
                computedArray[method].should.be.a.Function;
            });
        });

        it("should return plain value when using direct methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            ko_.addTo(computedArray);

            var filtered = computedArray.filter(num => num % 2 === 0);

            filtered.should.be.an.Array;
            filtered.length.should.equal(2);
        });

        it("should return synced computed value when using 'underscored' methods", () => {
            var obsArray = ko.observableArray(_.range(1, 6)),
                computedArray: any = ko.computed(() => obsArray());

            ko_.addTo(computedArray);

            var filtered = computedArray._filter(num => num % 2 === 0);

            ko.isComputed(filtered).should.be.ok;

            filtered().should.be.an.Array;
            filtered().length.should.equal(2);

            obsArray.push(6, 7, 8);

            filtered().length.should.equal(4);
        });

    });

});
