(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["exports", "knockout", "underscore"], factory);
    }
    else if (typeof exports === "object") {
        // CommonJS
        factory(exports, require("knockout"), require("underscore"));
    }
    else {
        // Browser globals
        root.ko_ = {};
        factory(root.ko_, root.ko, root._);
    }
}(this, function (exports, ko, _) {
    //#region UndescoreJS Extension
    var p = Array.prototype;
    _.mixin({
        sum: function (list, iterator, context) {
            /// <summary>Sum each item of given array by using specified iterator function</summary>
            /// <param name="list" type="Array">Array to sum in</param>
            /// <param name="iterator" type="Function">Function which return operand for sum</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Sum of result obtained by iterator method against each array element</returns>
            var result = 0;
            _.each(list, function () {
                result += iterator.apply(context, arguments);
            });
            return result;
        },
        average: function (list, iterator, context) {
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
        count: function (list, iterator, context) {
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
        filterMap: function (list, iterator, context) {
            /// <summary>Select is a mapping and filtering function, iterator can map or return false or undefined to filter items</summary>
            /// <param name="list" type="Array">Array to select items</param>
            /// <param name="iterator" type="Function">Function which filter and map items</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Array">Array of mapped and filtered items</returns>
            var result = [];
            _.each(list, function () {
                var item = iterator.apply(context, arguments);
                if (item) {
                    result.push(item);
                }
            });
            return result;
        },
        index: function (list, iterator, context) {
            /// <summary>Get index of first item with which iterator function return true</summary>
            /// <param name="list" type="Array">Array to search</param>
            /// <param name="iterator" type="Function">Function which filter items by returning true or false</param>
            /// <param name="context" type="Object" optional="true">Context to bind iterator function</param>
            /// <returns type="Number">Index of first element filtered by iterator methods</returns>
            var result = -1;
            _.find(list, function (value, index) {
                if (iterator.apply(context, arguments) === true) {
                    result = index;
                    return true;
                }
                return false;
            });
            return result;
        },
        partialEnd: function (func) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return function () {
                return func.apply(this, p.slice.call(arguments).concat(args));
            };
        }
    });
    //#endregion
    //#region UnderscoreJS wrapping for Knockout
    function createSimpleFunction(method, check) {
        return function () {
            var value = this();
            if (check && !_.isArray(value)) {
                value = _.values(value);
            }
            p.unshift.call(arguments, value);
            return _[method].apply(_, arguments);
        };
    }
    function createComputedFunction(method, pure, extend) {
        return function () {
            var args = arguments;
            var result = ko.computed({
                read: function () {
                    return this[method].apply(this, args);
                },
                pure: pure || false,
                owner: this
            });
            if (extend) {
                result = result.extend({ underscore: "collection" });
            }
            return result;
        };
    }
    exports.objects = (function () {
        var obj = {};
        _.each(["keys", "values"], function (method) {
            obj[method] = createSimpleFunction(method);
            obj["_" + method] = createComputedFunction(method, true, true);
            obj["__" + method] = createComputedFunction(method, false, true);
        });
        _.each(["clone", "isEmpty"], function (method) {
            obj[method] = createSimpleFunction(method);
            obj["_" + method] = createComputedFunction(method, true);
            obj["__" + method] = createComputedFunction(method, false);
        });
        return obj;
    })();
    exports.collections = (function () {
        var obj = {};
        _.each(["map", "filterMap", "filter", "reject", "sortBy", "toArray"], function (method) {
            obj[method] = createSimpleFunction(method);
            obj["_" + method] = createComputedFunction(method, true, true);
            obj["__" + method] = createComputedFunction(method, false, true);
        });
        _.each(["each", "reduce", "find", "sum", "average", "all", "any", "contains", "min", "max", "groupBy", "count", "index", "size"], function (method) {
            obj[method] = createSimpleFunction(method);
            obj["_" + method] = createComputedFunction(method, true);
            obj["__" + method] = createComputedFunction(method, false);
        });
        _.each(["initial", "rest", "compact", "flatten", "without", "union", "intersection", "difference", "uniq"], function (method) {
            obj[method] = createSimpleFunction(method, true);
            obj["_" + method] = createComputedFunction(method, true, true);
            obj["__" + method] = createComputedFunction(method, false, true);
        });
        _.each(["first", "last", "zip", "indexOf", "lastIndexOf"], function (method) {
            obj[method] = createSimpleFunction(method, true);
            obj["_" + method] = createComputedFunction(method, true);
            obj["__" + method] = createComputedFunction(method, false);
        });
        return obj;
    })();
    //#endregion
    //#region UnderscoreJS integration with KnockoutJS
    function addTo(val, mode) {
        if (mode === "object") {
            ko.utils.extend(val, exports.objects);
        }
        ko.utils.extend(val, exports.collections);
    }
    exports.addTo = addTo;
    addTo(ko.observableArray.fn);
    //#endregion
    //#region Extender
    ko.extenders.underscore = function (target, mode) {
        addTo(target, mode);
        return target;
    };
    //#endregion
}));
