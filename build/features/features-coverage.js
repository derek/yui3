if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/features/features.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/features/features.js",
    code: []
};
_yuitest_coverage["build/features/features.js"].code=["YUI.add('features', function (Y, NAME) {","","var feature_tests = {};","","/**","Contains the core of YUI's feature test architecture.","@module features","*/","","/**","* Feature detection","* @class Features","* @static","*/","","Y.mix(Y.namespace('Features'), {","    ","    /**","    * Object hash of all registered feature tests","    * @property tests","    * @type Object","    */","    tests: feature_tests,","    ","    /**","    * Add a test to the system","    * ","    *   ```","    *   Y.Features.add(\"load\", \"1\", {});","    *   ```","    * ","    * @method add","    * @param {String} cat The category, right now only 'load' is supported","    * @param {String} name The number sequence of the test, how it's reported in the URL or config: 1, 2, 3","    * @param {Object} o Object containing test properties","    * @param {String} o.name The name of the test","    * @param {Function} o.test The test function to execute, the only argument to the function is the `Y` instance","    * @param {String} o.trigger The module that triggers this test.","    */","    add: function(cat, name, o) {","        feature_tests[cat] = feature_tests[cat] || {};","        feature_tests[cat][name] = o;","    },","    /**","    * Execute all tests of a given category and return the serialized results","    *","    *   ```","    *   caps=1:1;2:1;3:0","    *   ```","    * @method all","    * @param {String} cat The category to execute","    * @param {Array} args The arguments to pass to the test function","    * @return {String} A semi-colon separated string of tests and their success/failure: 1:1;2:1;3:0","    */","    all: function(cat, args) {","        var cat_o = feature_tests[cat],","            // results = {};","            result = [];","        if (cat_o) {","            Y.Object.each(cat_o, function(v, k) {","                result.push(k + ':' + (Y.Features.test(cat, k, args) ? 1 : 0));","            });","        }","","        return (result.length) ? result.join(';') : '';","    },","    /**","    * Run a sepecific test and return a Boolean response.","    *","    *   ```","    *   Y.Features.test(\"load\", \"1\");","    *   ```","    *","    * @method test","    * @param {String} cat The category of the test to run","    * @param {String} name The name of the test to run","    * @param {Array} args The arguments to pass to the test function","    * @return {Boolean} True or false if the test passed/failed.","    */","    test: function(cat, name, args) {","        args = args || [];","        var result, ua, test,","            cat_o = feature_tests[cat],","            feature = cat_o && cat_o[name];","","        if (!feature) {","        } else {","","            result = feature.result;","","            if (Y.Lang.isUndefined(result)) {","","                ua = feature.ua;","                if (ua) {","                    result = (Y.UA[ua]);","                }","","                test = feature.test;","                if (test && ((!ua) || result)) {","                    result = test.apply(Y, args);","                }","","                feature.result = result;","            }","        }","","        return result;","    }","});","","// Y.Features.add(\"load\", \"1\", {});","// Y.Features.test(\"load\", \"1\");","// caps=1:1;2:0;3:1;","","/* This file is auto-generated by (yogi loader --yes --mix --start ../) */","var add = Y.Features.add;","// app-transitions-native","add('load', '0', {","    \"name\": \"app-transitions-native\",","    \"test\": function (Y) {","    var doc  = Y.config.doc,","        node = doc ? doc.documentElement : null;","","    if (node && node.style) {","        return ('MozTransition' in node.style || 'WebkitTransition' in node.style || 'transition' in node.style);","    }","","    return false;","},","    \"trigger\": \"app-transitions\"","});","// autocomplete-list-keys","add('load', '1', {","    \"name\": \"autocomplete-list-keys\",","    \"test\": function (Y) {","    // Only add keyboard support to autocomplete-list if this doesn't appear to","    // be an iOS or Android-based mobile device.","    //","    // There's currently no feasible way to actually detect whether a device has","    // a hardware keyboard, so this sniff will have to do. It can easily be","    // overridden by manually loading the autocomplete-list-keys module.","    //","    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari","    // doesn't fire the keyboard events used by AutoCompleteList, so there's","    // no point loading the -keys module even when a bluetooth keyboard may be","    // available.","    return !(Y.UA.ios || Y.UA.android);","},","    \"trigger\": \"autocomplete-list\"","});","// dd-gestures","add('load', '2', {","    \"name\": \"dd-gestures\",","    \"trigger\": \"dd-drag\",","    \"ua\": \"touchEnabled\"","});","// dom-style-ie","add('load', '3', {","    \"name\": \"dom-style-ie\",","    \"test\": function (Y) {","","    var testFeature = Y.Features.test,","        addFeature = Y.Features.add,","        WINDOW = Y.config.win,","        DOCUMENT = Y.config.doc,","        DOCUMENT_ELEMENT = 'documentElement',","        ret = false;","","    addFeature('style', 'computedStyle', {","        test: function() {","            return WINDOW && 'getComputedStyle' in WINDOW;","        }","    });","","    addFeature('style', 'opacity', {","        test: function() {","            return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;","        }","    });","","    ret =  (!testFeature('style', 'opacity') &&","            !testFeature('style', 'computedStyle'));","","    return ret;","},","    \"trigger\": \"dom-style\"","});","// editor-para-ie","add('load', '4', {","    \"name\": \"editor-para-ie\",","    \"trigger\": \"editor-para\",","    \"ua\": \"ie\",","    \"when\": \"instead\"","});","// event-base-ie","add('load', '5', {","    \"name\": \"event-base-ie\",","    \"test\": function(Y) {","    var imp = Y.config.doc && Y.config.doc.implementation;","    return (imp && (!imp.hasFeature('Events', '2.0')));","},","    \"trigger\": \"node-base\"","});","// graphics-canvas","add('load', '6', {","    \"name\": \"graphics-canvas\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext(\"2d\"));","},","    \"trigger\": \"graphics\"","});","// graphics-canvas-default","add('load', '7', {","    \"name\": \"graphics-canvas-default\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext(\"2d\"));","},","    \"trigger\": \"graphics\"","});","// graphics-svg","add('load', '8', {","    \"name\": \"graphics-svg\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    ","    return svg && (useSVG || !canvas);","},","    \"trigger\": \"graphics\"","});","// graphics-svg-default","add('load', '9', {","    \"name\": \"graphics-svg-default\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != \"canvas\",","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\"),","        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\"));","    ","    return svg && (useSVG || !canvas);","},","    \"trigger\": \"graphics\"","});","// graphics-vml","add('load', '10', {","    \"name\": \"graphics-vml\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\");","    return (DOCUMENT && !DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\") && (!canvas || !canvas.getContext || !canvas.getContext(\"2d\")));","},","    \"trigger\": \"graphics\"","});","// graphics-vml-default","add('load', '11', {","    \"name\": \"graphics-vml-default\",","    \"test\": function(Y) {","    var DOCUMENT = Y.config.doc,","		canvas = DOCUMENT && DOCUMENT.createElement(\"canvas\");","    return (DOCUMENT && !DOCUMENT.implementation.hasFeature(\"http://www.w3.org/TR/SVG11/feature#BasicStructure\", \"1.1\") && (!canvas || !canvas.getContext || !canvas.getContext(\"2d\")));","},","    \"trigger\": \"graphics\"","});","// history-hash-ie","add('load', '12', {","    \"name\": \"history-hash-ie\",","    \"test\": function (Y) {","    var docMode = Y.config.doc && Y.config.doc.documentMode;","","    return Y.UA.ie && (!('onhashchange' in Y.config.win) ||","            !docMode || docMode < 8);","},","    \"trigger\": \"history-hash\"","});","// io-nodejs","add('load', '13', {","    \"name\": \"io-nodejs\",","    \"trigger\": \"io-base\",","    \"ua\": \"nodejs\"","});","// json-parse-shim","add('load', '14', {","    \"name\": \"json-parse-shim\",","    \"test\": function (Y) {","    var _JSON = Y.config.global.JSON,","        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,","        nativeSupport = Y.config.useNativeJSONParse !== false && !!Native;","","    function workingNative( k, v ) {","        return k === \"ok\" ? true : v;","    }","    ","    // Double check basic functionality.  This is mainly to catch early broken","    // implementations of the JSON API in Firefox 3.1 beta1 and beta2","    if ( nativeSupport ) {","        try {","            nativeSupport = ( Native.parse( '{\"ok\":false}', workingNative ) ).ok;","        }","        catch ( e ) {","            nativeSupport = false;","        }","    }","","    return !nativeSupport;","},","    \"trigger\": \"json-parse\"","});","// json-stringify-shim","add('load', '15', {","    \"name\": \"json-stringify-shim\",","    \"test\": function (Y) {","    var _JSON = Y.config.global.JSON,","        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,","        nativeSupport = Y.config.useNativeJSONStringify !== false && !!Native;","","    // Double check basic native functionality.  This is primarily to catch broken","    // early JSON API implementations in Firefox 3.1 beta1 and beta2.","    if ( nativeSupport ) {","        try {","            nativeSupport = ( '0' === Native.stringify(0) );","        } catch ( e ) {","            nativeSupport = false;","        }","    }","","","    return !nativeSupport;","},","    \"trigger\": \"json-stringify\"","});","// scrollview-base-ie","add('load', '16', {","    \"name\": \"scrollview-base-ie\",","    \"trigger\": \"scrollview-base\",","    \"ua\": \"ie\"","});","// selector-css2","add('load', '17', {","    \"name\": \"selector-css2\",","    \"test\": function (Y) {","    var DOCUMENT = Y.config.doc,","        ret = DOCUMENT && !('querySelectorAll' in DOCUMENT);","","    return ret;","},","    \"trigger\": \"selector\"","});","// transition-timer","add('load', '18', {","    \"name\": \"transition-timer\",","    \"test\": function (Y) {","    var DOCUMENT = Y.config.doc,","        node = (DOCUMENT) ? DOCUMENT.documentElement: null,","        ret = true;","","    if (node && node.style) {","        ret = !('MozTransition' in node.style || 'WebkitTransition' in node.style || 'transition' in node.style);","    }","","    return ret;","},","    \"trigger\": \"transition\"","});","// widget-base-ie","add('load', '19', {","    \"name\": \"widget-base-ie\",","    \"trigger\": \"widget-base\",","    \"ua\": \"ie\"","});","// yql-nodejs","add('load', '20', {","    \"name\": \"yql-nodejs\",","    \"trigger\": \"yql\",","    \"ua\": \"nodejs\",","    \"when\": \"after\"","});","// yql-winjs","add('load', '21', {","    \"name\": \"yql-winjs\",","    \"trigger\": \"yql\",","    \"ua\": \"winjs\",","    \"when\": \"after\"","});","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/features/features.js"].lines = {"1":0,"3":0,"16":0,"41":0,"42":0,"56":0,"59":0,"60":0,"61":0,"65":0,"81":0,"82":0,"86":0,"89":0,"91":0,"93":0,"94":0,"95":0,"98":0,"99":0,"100":0,"103":0,"107":0,"116":0,"118":0,"121":0,"124":0,"125":0,"128":0,"133":0,"147":0,"152":0,"158":0,"162":0,"169":0,"171":0,"175":0,"177":0,"181":0,"184":0,"189":0,"196":0,"199":0,"200":0,"205":0,"208":0,"212":0,"217":0,"220":0,"224":0,"229":0,"232":0,"237":0,"242":0,"245":0,"250":0,"255":0,"258":0,"260":0,"265":0,"268":0,"270":0,"275":0,"278":0,"280":0,"286":0,"292":0,"295":0,"299":0,"300":0,"305":0,"306":0,"307":0,"310":0,"314":0,"319":0,"322":0,"328":0,"329":0,"330":0,"332":0,"337":0,"342":0,"348":0,"351":0,"354":0,"359":0,"362":0,"366":0,"367":0,"370":0,"375":0,"381":0,"388":0};
_yuitest_coverage["build/features/features.js"].functions = {"add:40":0,"(anonymous 2):60":0,"all:55":0,"test:80":0,"\"test\":120":0,"\"test\":135":0,"test:170":0,"test:176":0,"\"test\":160":0,"\"test\":198":0,"\"test\":207":0,"\"test\":219":0,"\"test\":231":0,"\"test\":244":0,"\"test\":257":0,"\"test\":267":0,"\"test\":277":0,"workingNative:299":0,"\"test\":294":0,"\"test\":321":0,"\"test\":350":0,"\"test\":361":0,"(anonymous 1):1":0};
_yuitest_coverage["build/features/features.js"].coveredLines = 94;
_yuitest_coverage["build/features/features.js"].coveredFunctions = 23;
_yuitest_coverline("build/features/features.js", 1);
YUI.add('features', function (Y, NAME) {

_yuitest_coverfunc("build/features/features.js", "(anonymous 1)", 1);
_yuitest_coverline("build/features/features.js", 3);
var feature_tests = {};

/**
Contains the core of YUI's feature test architecture.
@module features
*/

/**
* Feature detection
* @class Features
* @static
*/

_yuitest_coverline("build/features/features.js", 16);
Y.mix(Y.namespace('Features'), {
    
    /**
    * Object hash of all registered feature tests
    * @property tests
    * @type Object
    */
    tests: feature_tests,
    
    /**
    * Add a test to the system
    * 
    *   ```
    *   Y.Features.add("load", "1", {});
    *   ```
    * 
    * @method add
    * @param {String} cat The category, right now only 'load' is supported
    * @param {String} name The number sequence of the test, how it's reported in the URL or config: 1, 2, 3
    * @param {Object} o Object containing test properties
    * @param {String} o.name The name of the test
    * @param {Function} o.test The test function to execute, the only argument to the function is the `Y` instance
    * @param {String} o.trigger The module that triggers this test.
    */
    add: function(cat, name, o) {
        _yuitest_coverfunc("build/features/features.js", "add", 40);
_yuitest_coverline("build/features/features.js", 41);
feature_tests[cat] = feature_tests[cat] || {};
        _yuitest_coverline("build/features/features.js", 42);
feature_tests[cat][name] = o;
    },
    /**
    * Execute all tests of a given category and return the serialized results
    *
    *   ```
    *   caps=1:1;2:1;3:0
    *   ```
    * @method all
    * @param {String} cat The category to execute
    * @param {Array} args The arguments to pass to the test function
    * @return {String} A semi-colon separated string of tests and their success/failure: 1:1;2:1;3:0
    */
    all: function(cat, args) {
        _yuitest_coverfunc("build/features/features.js", "all", 55);
_yuitest_coverline("build/features/features.js", 56);
var cat_o = feature_tests[cat],
            // results = {};
            result = [];
        _yuitest_coverline("build/features/features.js", 59);
if (cat_o) {
            _yuitest_coverline("build/features/features.js", 60);
Y.Object.each(cat_o, function(v, k) {
                _yuitest_coverfunc("build/features/features.js", "(anonymous 2)", 60);
_yuitest_coverline("build/features/features.js", 61);
result.push(k + ':' + (Y.Features.test(cat, k, args) ? 1 : 0));
            });
        }

        _yuitest_coverline("build/features/features.js", 65);
return (result.length) ? result.join(';') : '';
    },
    /**
    * Run a sepecific test and return a Boolean response.
    *
    *   ```
    *   Y.Features.test("load", "1");
    *   ```
    *
    * @method test
    * @param {String} cat The category of the test to run
    * @param {String} name The name of the test to run
    * @param {Array} args The arguments to pass to the test function
    * @return {Boolean} True or false if the test passed/failed.
    */
    test: function(cat, name, args) {
        _yuitest_coverfunc("build/features/features.js", "test", 80);
_yuitest_coverline("build/features/features.js", 81);
args = args || [];
        _yuitest_coverline("build/features/features.js", 82);
var result, ua, test,
            cat_o = feature_tests[cat],
            feature = cat_o && cat_o[name];

        _yuitest_coverline("build/features/features.js", 86);
if (!feature) {
        } else {

            _yuitest_coverline("build/features/features.js", 89);
result = feature.result;

            _yuitest_coverline("build/features/features.js", 91);
if (Y.Lang.isUndefined(result)) {

                _yuitest_coverline("build/features/features.js", 93);
ua = feature.ua;
                _yuitest_coverline("build/features/features.js", 94);
if (ua) {
                    _yuitest_coverline("build/features/features.js", 95);
result = (Y.UA[ua]);
                }

                _yuitest_coverline("build/features/features.js", 98);
test = feature.test;
                _yuitest_coverline("build/features/features.js", 99);
if (test && ((!ua) || result)) {
                    _yuitest_coverline("build/features/features.js", 100);
result = test.apply(Y, args);
                }

                _yuitest_coverline("build/features/features.js", 103);
feature.result = result;
            }
        }

        _yuitest_coverline("build/features/features.js", 107);
return result;
    }
});

// Y.Features.add("load", "1", {});
// Y.Features.test("load", "1");
// caps=1:1;2:0;3:1;

/* This file is auto-generated by (yogi loader --yes --mix --start ../) */
_yuitest_coverline("build/features/features.js", 116);
var add = Y.Features.add;
// app-transitions-native
_yuitest_coverline("build/features/features.js", 118);
add('load', '0', {
    "name": "app-transitions-native",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 120);
_yuitest_coverline("build/features/features.js", 121);
var doc  = Y.config.doc,
        node = doc ? doc.documentElement : null;

    _yuitest_coverline("build/features/features.js", 124);
if (node && node.style) {
        _yuitest_coverline("build/features/features.js", 125);
return ('MozTransition' in node.style || 'WebkitTransition' in node.style || 'transition' in node.style);
    }

    _yuitest_coverline("build/features/features.js", 128);
return false;
},
    "trigger": "app-transitions"
});
// autocomplete-list-keys
_yuitest_coverline("build/features/features.js", 133);
add('load', '1', {
    "name": "autocomplete-list-keys",
    "test": function (Y) {
    // Only add keyboard support to autocomplete-list if this doesn't appear to
    // be an iOS or Android-based mobile device.
    //
    // There's currently no feasible way to actually detect whether a device has
    // a hardware keyboard, so this sniff will have to do. It can easily be
    // overridden by manually loading the autocomplete-list-keys module.
    //
    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari
    // doesn't fire the keyboard events used by AutoCompleteList, so there's
    // no point loading the -keys module even when a bluetooth keyboard may be
    // available.
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 135);
_yuitest_coverline("build/features/features.js", 147);
return !(Y.UA.ios || Y.UA.android);
},
    "trigger": "autocomplete-list"
});
// dd-gestures
_yuitest_coverline("build/features/features.js", 152);
add('load', '2', {
    "name": "dd-gestures",
    "trigger": "dd-drag",
    "ua": "touchEnabled"
});
// dom-style-ie
_yuitest_coverline("build/features/features.js", 158);
add('load', '3', {
    "name": "dom-style-ie",
    "test": function (Y) {

    _yuitest_coverfunc("build/features/features.js", "\"test\"", 160);
_yuitest_coverline("build/features/features.js", 162);
var testFeature = Y.Features.test,
        addFeature = Y.Features.add,
        WINDOW = Y.config.win,
        DOCUMENT = Y.config.doc,
        DOCUMENT_ELEMENT = 'documentElement',
        ret = false;

    _yuitest_coverline("build/features/features.js", 169);
addFeature('style', 'computedStyle', {
        test: function() {
            _yuitest_coverfunc("build/features/features.js", "test", 170);
_yuitest_coverline("build/features/features.js", 171);
return WINDOW && 'getComputedStyle' in WINDOW;
        }
    });

    _yuitest_coverline("build/features/features.js", 175);
addFeature('style', 'opacity', {
        test: function() {
            _yuitest_coverfunc("build/features/features.js", "test", 176);
_yuitest_coverline("build/features/features.js", 177);
return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;
        }
    });

    _yuitest_coverline("build/features/features.js", 181);
ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    _yuitest_coverline("build/features/features.js", 184);
return ret;
},
    "trigger": "dom-style"
});
// editor-para-ie
_yuitest_coverline("build/features/features.js", 189);
add('load', '4', {
    "name": "editor-para-ie",
    "trigger": "editor-para",
    "ua": "ie",
    "when": "instead"
});
// event-base-ie
_yuitest_coverline("build/features/features.js", 196);
add('load', '5', {
    "name": "event-base-ie",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 198);
_yuitest_coverline("build/features/features.js", 199);
var imp = Y.config.doc && Y.config.doc.implementation;
    _yuitest_coverline("build/features/features.js", 200);
return (imp && (!imp.hasFeature('Events', '2.0')));
},
    "trigger": "node-base"
});
// graphics-canvas
_yuitest_coverline("build/features/features.js", 205);
add('load', '6', {
    "name": "graphics-canvas",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 207);
_yuitest_coverline("build/features/features.js", 208);
var DOCUMENT = Y.config.doc,
        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    _yuitest_coverline("build/features/features.js", 212);
return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext("2d"));
},
    "trigger": "graphics"
});
// graphics-canvas-default
_yuitest_coverline("build/features/features.js", 217);
add('load', '7', {
    "name": "graphics-canvas-default",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 219);
_yuitest_coverline("build/features/features.js", 220);
var DOCUMENT = Y.config.doc,
        useCanvas = Y.config.defaultGraphicEngine && Y.config.defaultGraphicEngine == "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    _yuitest_coverline("build/features/features.js", 224);
return (!svg || useCanvas) && (canvas && canvas.getContext && canvas.getContext("2d"));
},
    "trigger": "graphics"
});
// graphics-svg
_yuitest_coverline("build/features/features.js", 229);
add('load', '8', {
    "name": "graphics-svg",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 231);
_yuitest_coverline("build/features/features.js", 232);
var DOCUMENT = Y.config.doc,
        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    
    _yuitest_coverline("build/features/features.js", 237);
return svg && (useSVG || !canvas);
},
    "trigger": "graphics"
});
// graphics-svg-default
_yuitest_coverline("build/features/features.js", 242);
add('load', '9', {
    "name": "graphics-svg-default",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 244);
_yuitest_coverline("build/features/features.js", 245);
var DOCUMENT = Y.config.doc,
        useSVG = !Y.config.defaultGraphicEngine || Y.config.defaultGraphicEngine != "canvas",
		canvas = DOCUMENT && DOCUMENT.createElement("canvas"),
        svg = (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
    
    _yuitest_coverline("build/features/features.js", 250);
return svg && (useSVG || !canvas);
},
    "trigger": "graphics"
});
// graphics-vml
_yuitest_coverline("build/features/features.js", 255);
add('load', '10', {
    "name": "graphics-vml",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 257);
_yuitest_coverline("build/features/features.js", 258);
var DOCUMENT = Y.config.doc,
		canvas = DOCUMENT && DOCUMENT.createElement("canvas");
    _yuitest_coverline("build/features/features.js", 260);
return (DOCUMENT && !DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (!canvas || !canvas.getContext || !canvas.getContext("2d")));
},
    "trigger": "graphics"
});
// graphics-vml-default
_yuitest_coverline("build/features/features.js", 265);
add('load', '11', {
    "name": "graphics-vml-default",
    "test": function(Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 267);
_yuitest_coverline("build/features/features.js", 268);
var DOCUMENT = Y.config.doc,
		canvas = DOCUMENT && DOCUMENT.createElement("canvas");
    _yuitest_coverline("build/features/features.js", 270);
return (DOCUMENT && !DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (!canvas || !canvas.getContext || !canvas.getContext("2d")));
},
    "trigger": "graphics"
});
// history-hash-ie
_yuitest_coverline("build/features/features.js", 275);
add('load', '12', {
    "name": "history-hash-ie",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 277);
_yuitest_coverline("build/features/features.js", 278);
var docMode = Y.config.doc && Y.config.doc.documentMode;

    _yuitest_coverline("build/features/features.js", 280);
return Y.UA.ie && (!('onhashchange' in Y.config.win) ||
            !docMode || docMode < 8);
},
    "trigger": "history-hash"
});
// io-nodejs
_yuitest_coverline("build/features/features.js", 286);
add('load', '13', {
    "name": "io-nodejs",
    "trigger": "io-base",
    "ua": "nodejs"
});
// json-parse-shim
_yuitest_coverline("build/features/features.js", 292);
add('load', '14', {
    "name": "json-parse-shim",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 294);
_yuitest_coverline("build/features/features.js", 295);
var _JSON = Y.config.global.JSON,
        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,
        nativeSupport = Y.config.useNativeJSONParse !== false && !!Native;

    _yuitest_coverline("build/features/features.js", 299);
function workingNative( k, v ) {
        _yuitest_coverfunc("build/features/features.js", "workingNative", 299);
_yuitest_coverline("build/features/features.js", 300);
return k === "ok" ? true : v;
    }
    
    // Double check basic functionality.  This is mainly to catch early broken
    // implementations of the JSON API in Firefox 3.1 beta1 and beta2
    _yuitest_coverline("build/features/features.js", 305);
if ( nativeSupport ) {
        _yuitest_coverline("build/features/features.js", 306);
try {
            _yuitest_coverline("build/features/features.js", 307);
nativeSupport = ( Native.parse( '{"ok":false}', workingNative ) ).ok;
        }
        catch ( e ) {
            _yuitest_coverline("build/features/features.js", 310);
nativeSupport = false;
        }
    }

    _yuitest_coverline("build/features/features.js", 314);
return !nativeSupport;
},
    "trigger": "json-parse"
});
// json-stringify-shim
_yuitest_coverline("build/features/features.js", 319);
add('load', '15', {
    "name": "json-stringify-shim",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 321);
_yuitest_coverline("build/features/features.js", 322);
var _JSON = Y.config.global.JSON,
        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,
        nativeSupport = Y.config.useNativeJSONStringify !== false && !!Native;

    // Double check basic native functionality.  This is primarily to catch broken
    // early JSON API implementations in Firefox 3.1 beta1 and beta2.
    _yuitest_coverline("build/features/features.js", 328);
if ( nativeSupport ) {
        _yuitest_coverline("build/features/features.js", 329);
try {
            _yuitest_coverline("build/features/features.js", 330);
nativeSupport = ( '0' === Native.stringify(0) );
        } catch ( e ) {
            _yuitest_coverline("build/features/features.js", 332);
nativeSupport = false;
        }
    }


    _yuitest_coverline("build/features/features.js", 337);
return !nativeSupport;
},
    "trigger": "json-stringify"
});
// scrollview-base-ie
_yuitest_coverline("build/features/features.js", 342);
add('load', '16', {
    "name": "scrollview-base-ie",
    "trigger": "scrollview-base",
    "ua": "ie"
});
// selector-css2
_yuitest_coverline("build/features/features.js", 348);
add('load', '17', {
    "name": "selector-css2",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 350);
_yuitest_coverline("build/features/features.js", 351);
var DOCUMENT = Y.config.doc,
        ret = DOCUMENT && !('querySelectorAll' in DOCUMENT);

    _yuitest_coverline("build/features/features.js", 354);
return ret;
},
    "trigger": "selector"
});
// transition-timer
_yuitest_coverline("build/features/features.js", 359);
add('load', '18', {
    "name": "transition-timer",
    "test": function (Y) {
    _yuitest_coverfunc("build/features/features.js", "\"test\"", 361);
_yuitest_coverline("build/features/features.js", 362);
var DOCUMENT = Y.config.doc,
        node = (DOCUMENT) ? DOCUMENT.documentElement: null,
        ret = true;

    _yuitest_coverline("build/features/features.js", 366);
if (node && node.style) {
        _yuitest_coverline("build/features/features.js", 367);
ret = !('MozTransition' in node.style || 'WebkitTransition' in node.style || 'transition' in node.style);
    }

    _yuitest_coverline("build/features/features.js", 370);
return ret;
},
    "trigger": "transition"
});
// widget-base-ie
_yuitest_coverline("build/features/features.js", 375);
add('load', '19', {
    "name": "widget-base-ie",
    "trigger": "widget-base",
    "ua": "ie"
});
// yql-nodejs
_yuitest_coverline("build/features/features.js", 381);
add('load', '20', {
    "name": "yql-nodejs",
    "trigger": "yql",
    "ua": "nodejs",
    "when": "after"
});
// yql-winjs
_yuitest_coverline("build/features/features.js", 388);
add('load', '21', {
    "name": "yql-winjs",
    "trigger": "yql",
    "ua": "winjs",
    "when": "after"
});

}, '@VERSION@', {"requires": ["yui-base"]});
