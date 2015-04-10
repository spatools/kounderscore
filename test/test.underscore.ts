/// <reference path="../_definitions.d.ts" />
/// <amd-dependency path="kounderscore" />

import _ = require("underscore");
import ko = require("knockout");
import ko_ = require("kounderscore");

describe("Underscore.js extensions", () => {

    describe("sum method", () => {

        it("should return sum of each element based on given iterator", () => {
            var range = _.range(1, 6),
                sum = _.sum(range, (val) => val);

            sum.should.be.a.Number;
            sum.should.equal(15);
        });

        it("should return 0 if list is empty", () => {
            var sum = _.sum([], (val) => val);

            sum.should.be.a.Number;
            sum.should.equal(0);
        });

    });

    describe("average method", () => {

        it("should return average of each element based on given iterator", () => {
            var range = _.range(1, 6),
                average = _.average(range, (val) => val);

            average.should.be.a.Number;
            average.should.equal(3);
        });

        it("should return 0 if list is empty", () => {
            var average = _.average([], (val) => val);

            average.should.be.a.Number;
            average.should.equal(0);
        });

    });

    describe("count method", () => {

        it("should return the number of element which match the given iterator", () => {
            var range = _.range(1, 6),
                count = _.count(range, (val) => val % 2 === 0);

            count.should.be.a.Number;
            count.should.equal(2);
        });

        it("should return 0 if list is empty", () => {
            var count = _.count([], (val) => val);

            count.should.be.a.Number;
            count.should.equal(0);
        });

    });

    describe("filterMap method", () => {

        it("should return non undefined mapped elements using given iterator", () => {
            var range = _.range(1, 6),
                mapped = _.filterMap(range, (val) => val % 2 === 0 && val * 2);

            mapped.should.be.an.Array;
            mapped.length.should.equal(2);

            mapped[0].should.equal(4);
            mapped[1].should.equal(8);
        });

    });

    describe("index method", () => {

        it("should return the index of the first element which match the given iterator", () => {
            var range = _.range(1, 6),
                index = _.index(range, (val) => val % 2 === 0);

            index.should.be.a.Number;
            index.should.equal(1);
        });

        it("should return -1 if no element match the given iterator", () => {
            var range = _.range(1, 6),
                index = _.index([], (val) => val === 99);

            index.should.be.a.Number;
            index.should.equal(-1);
        });

    });

    describe("partialEnd method", () => {

        it("should append given parameters at the end of the method", () => {
            var spy = sinon.spy(),
                spy2 = sinon.spy(),

                partialledSpy = _.partialEnd(spy, 1, 2),
                partialledSpy2 = _.partialEnd(spy2, 3, 4);

            partialledSpy();
            partialledSpy2(1, 2);

            sinon.assert.calledOnce(spy);
            sinon.assert.calledOnce(spy2);

            sinon.assert.calledWithExactly(spy, 1, 2);
            sinon.assert.calledWithExactly(spy2, 1, 2, 3, 4);
        });

    });

});
