/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

var CACHED_DELIMITER = '__',

    hasOwn   = Object.prototype.hasOwnProperty,
    isObject = Y.Lang.isObject;

/**
 * Returns a new object containing all of the properties of
 * all the supplied objects.  The properties from later objects
 * will overwrite those in earlier objects.  Passing in a
 * single object will create a shallow copy of it.  For a deep
 * copy, use clone.
 * @method merge
 * @for YUI
 * @param arguments {Object*} the objects to merge.
 * @return {object} the new merged object.
 */
Y.merge = function() {
    var a = arguments, o = {}, i, l = a.length;
    for (i = 0; i < l; i = i + 1) {
        Y.mix(o, a[i], true);
    }
    return o;
};

/**
 * Mixes _supplier_'s properties into _receiver_. Properties will not be
 * overwritten or merged unless the _overwrite_ or _merge_ parameters are
 * `true`, respectively.
 *
 * In the default mode (0), only properties the supplier owns are copied
 * (prototype properties are not copied). The following copying modes are
 * available:
 *
 *   * `0`: _Default_. Object to object.
 *   * `1`: Prototype to prototype.
 *   * `2`: Prototype to prototype and object to object.
 *   * `3`: Prototype to object.
 *   * `4`: Object to prototype.
 *
 * @method mix
 * @param {Function|Object} receiver The object or function to receive the mixed
 *   properties.
 * @param {Function|Object} supplier The object or function supplying the
 *   properties to be mixed.
 * @param {Boolean} [overwrite=false] If `true`, properties that already exist
 *   on the receiver will be overwritten with properties from the supplier.
 * @param {String[]} [whitelist] An array of property names to copy. If
 *   specified, only the whitelisted properties will be copied, and all others
 *   will be ignored.
 * @param {Int} [mode=0] Mix mode to use. See above for available modes.
 * @param {Boolean} [merge=false] If `true`, objects and arrays that already
 *   exist on the receiver will have the corresponding object/array from the
 *   supplier merged into them, rather than being skipped or overwritten. When
 *   both _overwrite_ and _merge_ are `true`, _merge_ takes precedence.
 * @return {Function|Object|YUI} The receiver, or the YUI instance if the
 *   specified receiver is falsy.
 */
Y.mix = function(receiver, supplier, overwrite, whitelist, mode, merge) {
    var alwaysOverwrite, exists, from, i, key, len, to;

    // If no supplier is given, we return the receiver. If no receiver is given,
    // we return Y. Returning Y doesn't make much sense to me, but it's
    // grandfathered in for backcompat reasons.
    if (!receiver || !supplier) {
        return receiver || Y;
    }

    if (mode) {
        // In mode 2 (prototype to prototype and object to object), we recurse
        // once to do the proto to proto mix. The object to object mix will be
        // handled later on.
        if (mode === 2) {
            Y.mix(receiver.prototype, supplier.prototype, overwrite,
                    whitelist, 0, merge);
        }

        // Depending on which mode is specified, we may be copying from or to
        // the prototypes of the supplier and receiver.
        from = mode === 1 || mode === 3 ? supplier.prototype : supplier;
        to   = mode === 1 || mode === 4 ? receiver.prototype : receiver;

        // If either the supplier or receiver doesn't actually have a
        // prototype property, then we could end up with an undefined `from`
        // or `to`. If that happens, we abort and return the receiver.
        if (!from || !to) {
            return receiver;
        }
    } else {
        from = supplier;
        to   = receiver;
    }

    // If `overwrite` is truthy and `merge` is falsy, then we can skip a call
    // to `hasOwnProperty` on each iteration and save some time.
    alwaysOverwrite = overwrite && !merge;

    if (whitelist) {
        for (i = 0, len = whitelist.length; i < len; ++i) {
            key = whitelist[i];

            // We call `Object.prototype.hasOwnProperty` instead of calling
            // `hasOwnProperty` on the object itself, since the object's
            // `hasOwnProperty` method may have been overridden or removed.
            // Also, some native objects don't implement a `hasOwnProperty`
            // method.
            if (!hasOwn.call(from, key)) {
                continue;
            }

            exists = alwaysOverwrite ? false : hasOwn.call(to, key);

            if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                // If we're in merge mode, and the key is present on both
                // objects, and the value on both objects is either an object or
                // an array (but not a function), then we recurse to merge the
                // `from` value into the `to` value instead of overwriting it.
                //
                // Note: It's intentional that the whitelist isn't passed to the
                // recursive call here. This is legacy behavior that lots of
                // code still depends on.
                Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else if (overwrite || !exists) {
                // We're not in merge mode, so we'll only copy the `from` value
                // to the `to` value if we're in overwrite mode or if the
                // current key doesn't exist on the `to` object.
                to[key] = from[key];
            }
        }
    } else {
        for (key in from) {
            // The code duplication here is for runtime performance reasons.
            // Combining whitelist and non-whitelist operations into a single
            // loop or breaking the shared logic out into a function both result
            // in worse performance, and Y.mix is critical enough that the byte
            // tradeoff is worth it.
            if (!hasOwn.call(from, key)) {
                continue;
            }

            exists = alwaysOverwrite ? false : hasOwn.call(to, key);

            if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else if (overwrite || !exists) {
                to[key] = from[key];
            }
        }

        // If this is an IE browser with the JScript enumeration bug, force
        // enumeration of the buggy properties by making a recursive call with
        // the buggy properties as the whitelist.
        if (Y.Object._hasEnumBug) {
            Y.mix(to, from, overwrite, Y.Object._forceEnum, mode, merge);
        }
    }

    return receiver;
};

/**
 * Returns a wrapper for a function which caches the
 * return value of that function, keyed off of the combined
 * argument values.
 * @method cached
 * @param source {function} the function to memoize.
 * @param cache an optional cache seed.
 * @param refetch if supplied, this value is tested against the cached
 * value.  If the values are equal, the wrapped function is executed again.
 * @return {Function} the wrapped function.
 */
Y.cached = function(source, cache, refetch) {
    cache = cache || {};

    return function(arg1) {

        var k = (arguments.length > 1) ?
            Array.prototype.join.call(arguments, CACHED_DELIMITER) : arg1;

        if (!(k in cache) || (refetch && cache[k] == refetch)) {
            // source is passed as the 'this' object because the calling
            // function cannot safely use 'this' in its body.  'this' implies
            // additional data from an external variable (in that case, the
            // instance of a class), but that variable is not captured in the
            // calling args, which means if 'this' were used in the memoized
            // function, the result from the first call to the function would
            // be cached and used by all future calls with the same calling
            // args. That result might not have been the same for the other
            // calls because the data referenced from 'this' in those calls
            // might have been different from that used in the first call.
            cache[k] = source.apply(source, arguments);
        }

        return cache[k];
    };

};

