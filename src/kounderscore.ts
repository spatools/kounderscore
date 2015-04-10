(function (root, factory: (exports: KnockoutUnderscore, ko: KnockoutStatic, _: UnderscoreStatic) => void) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["exports", "knockout", "underscore"], factory);
    } else if (typeof exports === "object") {
        // CommonJS
        factory(exports, require("knockout"), require("underscore"));
    } else {
        // Browser globals
        root.ko_ = {};
        factory(root.ko_, root.ko, root._);
    }
} (this, function (exports, ko, _) {

    //#region UndescoreJS Extension

    var p = Array.prototype;

    _.mixin({
        sum: function <T>(list: _.List<T>, iterator: _.ListIterator<T, number>, context?: any): number {
            /// <summary>Sum each item of given array by using specified iterator function</summary>
            /// <param name="list" type="Array">Array to sum in</param>
            /// <param name="iterator" type="Function">Function which return operand for sum</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Sum of result obtained by iterator method against each array element</returns>

            var result = 0;

            _.each(list, () => {
                result += iterator.apply(context, arguments);
            });

            return result;
        },
        average: function <T>(list: _.List<T>, iterator: _.ListIterator<T, number>, context?: any): number {
            /// <summary>Create average from each item of given array by using specified iterator function</summary>
            /// <param name="list" type="Array">Array to average items</param>
            /// <param name="iterator" type="Function">Function which return operand for average</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Average of result obtained by iterator method against each array element</returns>

            if (list.length === 0) {
                return 0;
            }

            return _.sum(list, iterator, context) / list.length;
        },
        count: function <T>(list: _.List<T>, iterator?: _.ListIterator<T, boolean>, context?: any): number {
            /// <summary>Count items in given list filtered by given iterator function</summary>
            /// <param name="list" type="Array">Array to count items</param>
            /// <param name="iterator" type="Function">Function which filter array items</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Items count</returns>

            if (!iterator) {
                return _.size(list);
            }

            return _.filter(list, iterator, context).length;
        },
        filterMap: function <T, TResult>(list: _.List<T>, iterator: _.ListIterator<T, TResult>, context?: any): TResult[] {
            /// <summary>Select is a mapping and filtering function, iterator can map or return false or undefined to filter items</summary>
            /// <param name="list" type="Array">Array to select items</param>
            /// <param name="iterator" type="Function">Function which filter and map items</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Array">Array of mapped and filtered items</returns>

            var result = [];

            _.each(list, () => {
                var item = iterator.apply(context, arguments);
                if (item) {
                    result.push(item);
                }
            });

            return result;
        },
        index: function <T>(list: _.List<T>, iterator?: _.ListIterator<T, boolean>, context?: any): number {
            /// <summary>Get index of first item with which iterator function return true</summary>
            /// <param name="list" type="Array">Array to search</param>
            /// <param name="iterator" type="Function">Function which filter items by returning true or false</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Index of first element filtered by iterator methods</returns>

            var result = -1;
            _.find(list, (value, index) => {
                if (iterator.apply(context, arguments) === true) {
                    result = index;
                    return true;
                }

                return false;
            });

            return result;
        },
        partialEnd: function (func: Function, ...args: any[]): Function {
            return function () {
                return func.apply(this, p.slice.call(arguments).concat(args));
            };
        }
    });

    //#endregion

    //#region UnderscoreJS integration with KnockoutJS

    exports.objects = {};
    exports.collections = {};

    _.each(["keys", "values", "clone", "isEmpty"], method => {
        exports.objects["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.objects[method] = function () {
            p.unshift.call(arguments, this());
            return _[method].apply(_, arguments);
        };
    });
    _.each(["each", "map", "filterMap", "reduce", "find", "filter", "reject", "sum", "average", "all", "any", "contains", "max", "min", "sortBy", "groupBy", "toArray", "count", "size", "index"], method => {
        exports.collections["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.collections[method] = function () {
            p.unshift.call(arguments, this());
            return _[method].apply(_, arguments);
        };
    });
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection", "difference", "uniq", "zip", "indexOf", "lastIndexOf"], method =>  {
        exports.collections["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.collections[method] = function () {
            var value = this();
            p.unshift.call(arguments, _.isArray(value) ? value : _.values(value));
            return _[method].apply(_, arguments);
        };
    });

    function addToSubscribable<T>(val: KnockoutSubscribable<T>): void {
        ko.utils.extend(val, exports.collections);
    }
    exports.addToSubscribable = addToSubscribable;

    function addToPrototype(val: any): void {
        ko.utils.extend(val, exports.collections);
    }
    exports.addToPrototype = addToPrototype;

    ko.utils.extend(ko.observableArray.fn, exports.collections);

    //#endregion

}));
