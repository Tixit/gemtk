window["gem/Style"]=Gem.Style;window["gem/Block"]=Gem.Block;window["gem/Button"]=Gem.Button;window["gem/Canvas"]=Gem.Canvas;window["gem/CheckBox"]=Gem.CheckBox;window["gem/Image"]=Gem.Image;window["gem/List"]=Gem.List;window["gem/Radio"]=Gem.Radio;window["gem/Select"]=Gem.Select;window["gem/Svg"]=Gem.Svg;window["gem/Table"]=Gem.Table;window["gem/Text"]=Gem.Text;window["gem/TextArea"]=Gem.TextArea;window["gem/TextField"]=Gem.TextField;window.gem=Gem;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("proto"), require("gem"), require("gem/Style"), require("gem/Text"));
	else if(typeof define === 'function' && define.amd)
		define(["proto", "gem", "gem/Style", "gem/Text"], factory);
	else if(typeof exports === 'object')
		exports["TextEditor"] = factory(require("proto"), require("gem"), require("gem/Style"), require("gem/Text"));
	else
		root["TextEditor"] = factory(root["proto"], root["gem"], root["gem/Style"], root["gem/Text"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./TextEditor.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 1)
var ks = __webpack_require__(/*! keysight */ 2)

var Gem = __webpack_require__(/*! gem */ 3);
var Style = __webpack_require__(/*! gem/Style */ 4)
var Text = __webpack_require__(/*! gem/Text */ 5)

module.exports = proto(Gem, function(superclass) {
    this.name = 'TextEditor'

    this.defaultStyle = Style({
        Text: {
            minWidth: 100,
            wordBreak: 'break-word'
        },
        $emptyText: {
            $inherit: true,
            position: 'absolute', //top: 4, left: 4,
            pointerEvents:'none',
            color: 'rgb(190,190,190)'
        }
    })

    // label - A label to put on the component (for styling)
    // options can contain:
        // characterFilter - A function that's passed a character from the 'keydown' event, and should return true if the character is allowable
        // emptyText - Text to be displayed when the field is undefined
        // initial - The initial value
        // proxyEvents - A list of events to proxy. Defaults to ['blur', 'focus']
    this.build = function(/*[label,] options*/) {
        if(arguments[0] instanceof Object) {
            var options = arguments[0]
        } else if(arguments[0] !== undefined) {
            var label = arguments[0]
            var options = arguments[1]
        }

        if(options === undefined) options = {}
        if(options.emptyText === undefined) options.emptyText = ''

        var that = this

        if(label) this.label = label
        if(options.emptyText) {
            this.emptyText = Text('emptyText', options.emptyText)
            this.add(this.emptyText)
        }

        var text = this.textField = Text()
        text.attr("contenteditable", true)
        this.add(text)  // there's a reason this is wrapped in a container.. but i can't remember why
        if(options.initial !== undefined)
            this.text = options.initial

        if(options.characterFilter !== undefined) {
            this.on('keypress', function(event) {
                if(!options.characterFilter(ks(event).char)) {
                    event.preventDefault()
                }
            })
            this.on('paste', function(event) { // keypress doesn't seem to get paste events
                var types = event.clipboardData.types
                var pastedText = event.clipboardData.getData(types[0])
                for(var n in pastedText) {
                    if(!options.characterFilter(pastedText[n])) {
                        event.preventDefault()
                        break;
                    }
                }
            })
        }

        if(options.proxyEvents === undefined) {
            options.proxyEvents = ['blur', 'focus']
        }

        this.proxy(text, {only: options.proxyEvents})

        text.on('input', function() {
            that.renderEmptyText()
        })
        onceAfterCooldown(text, 'input', 200, function(event) {
            that.emit('change') // since contenteditable divs don't seem to emit change events
        })
    }

    this.renderEmptyText = function() {
        if(this.emptyText)
            this.emptyText.visible = this.empty
    }

    Object.defineProperty(this, 'text', {
        get: function() {
            var innerText = this.textField.domNode.innerText  // using innerText here because it preserves newlines

            // for some weird reason, two newlines are created in a contenteditable node when you press enter, and
            // so backspacing will only get rid of one and the result is that it looks empty but still has a single newline in it - ugh
            if(innerText[innerText.length-1] === '\n')
                innerText = innerText.slice(0,-1)
            return innerText
        },
        set: function(value) {
            if(value === undefined || value === '') {
                this.textField.text = ''
                if(this.emptyText)
                    this.emptyText.visible = true
            } else {
                this.textField.text = value
                if(this.emptyText)
                    this.emptyText.visible = false
            }
        }
    })

    Object.defineProperty(this, 'val', {
        get: function() {
            return this.text
        },
        set: function(value) {
            this.text = value
        }
    })

    Object.defineProperty(this, 'focus', {
        get: function() {return this.textField.focus},
        set: function(value) {this.textField.focus = value}
    })
    Object.defineProperty(this, 'selectionRange', {
        get: function() {return this.textField.selectionRange},
        set: function(value) {this.textField.selectionRange = value}
    })
})


// only fires the callback after a cooldown time has passed
// returns the event callback (so you can off it)
function onceAfterCooldown(gem, event, cooldownTime, callback) {
    var timeout, cb;
    gem.on(event, cb=function() {
        var args = arguments
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(function() { // only run new search when you stop typing
            timeout = undefined
            callback.apply(gem, args)
        },cooldownTime)
    })
    return cb
}


/***/ }),
/* 1 */
/*!************************!*\
  !*** external "proto" ***!
  \************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/*!*******************************************!*\
  !*** ./node_modules/keysight/keysight.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {


var keycodeShiftedKeys = {
    "/": "?",
    ".": ">",
    ",": "<",
    "\'": "\"",
    ";": ":",
    "[": "{",
    "]": "}",
    "\\": "|",
    "`": "~",
    "=": "+",
    "-": "_",
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")"
};

var keyCodeUnshiftedKeys = {}
for(var x in keycodeShiftedKeys) {
    var shiftedKey = keycodeShiftedKeys[x]
    keyCodeUnshiftedKeys[shiftedKey] = x
}

var keydownKeycodeDictionary = {
    0: "\\",

    8: "\b",
    9: "\t",

    12: "num",
    13: "\n",

    16: "shift",
    17: "meta",  // 'ctrl' on windows, 'cmd' on mac
    18: "alt",   // aka 'option'
    19: "pause", // or sometimes 'break'?
    20: "caps",

    27: "esc",

    32: " ",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",

    44: "print",
    45: "insert",
    46: "delete",

    // 48-90

//    48: "0",
//    49: "1",
//    50: "2",
//    51: "3",
//    52: "4",
//    53: "5",
//    54: "6",
//    55: "7",
//    56: "8",
//    57: "9",
//
//    59: ";",
//
//    61: "=",
//
//    65: "a",
//    66: "b",
//    67: "c",
//    68: "d",
//    69: "e",
//    70: "f",
//    71: "g",
//    72: "h",
//    73: "i",
//    74: "j",
//    75: "k",
//    76: "l",
//    77: "m",
//    78: "n",
//    79: "o",
//    80: "p",
//    81: "q",
//    82: "r",
//    83: "s",
//    84: "t",
//    85: "u",
//    86: "v",
//    87: "w",
//    88: "x",
//    89: "y",
//    90: "z",
    91: "cmd",   // 'left window key'
    92: "cmd",   // 'right window key'
    93: "cmd",   // 'select key'

    96: "num0",
    97: "num1",
    98: "num2",
    99: "num3",
    100: "num4",
    101: "num5",
    102: "num6",
    103: "num7",
    104: "num8",
    105: "num9",
    106: "*",
    107: "+",
    108: "num_enter",
    109: "num_subtract",
    110: "num_decimal",
    111: "num_divide",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    124: "print",

    144: "num",    // num lock
    145: "scroll", // scroll lock

    173: "-",

    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "\'",
    223: "`",
    224: "cmd",
    225: "alt",

    57392: "ctrl",
    63289: "num"
};

var keydownKeycodeReverseDictionary = {}
for(var x in keydownKeycodeDictionary) {
    var name = keydownKeycodeDictionary[x]
    keydownKeycodeReverseDictionary[name] = x
}

var keypressCharacterMap = {
    '\r':'\n'
}
var keydownCharacterMap = {
    num_subtract: '-',
    num_enter: '\n',
    num_decimal: '.',
    num_divide: '/'

}

function getKeypressKeycodeValue(charcode) {
    var character = String.fromCharCode(charcode)
    if(character in keyCodeUnshiftedKeys) {
        return keyCodeUnshiftedKeys[character]
    } else if(character in keypressCharacterMap) {
        return keypressCharacterMap[character]
    } else {
        return character.toLowerCase()
    }
}


module.exports = function(event) {
    if(event.type === 'keypress') {
        var key = getKeypressKeycodeValue(event.charCode)
    } else {
        if(event.keyCode !== undefined) {
            if(event.keyCode in keydownKeycodeDictionary) {
                var key = keydownKeycodeDictionary[event.keyCode]
            } else {
                var key = String.fromCharCode(event.keyCode).toLowerCase() // fall back to this in case the explicit map above doesn't cover something
            }
        } else if(event.charCode === 0) {
            var key = '\n'
        }
    }

    if(event.shiftKey && key in keycodeShiftedKeys) {
        var char = keycodeShiftedKeys[key]
    } else if(event.shiftKey && !(key in keydownKeycodeReverseDictionary)) {
        var char = key.toUpperCase() // fallback
    } else if(key in keydownCharacterMap) {
        var char = keydownCharacterMap[key]
    } else {
        var char = key
    }



    return {
        char: char,
        key: key
    }
}

module.exports.unprintableKeys = {
    "\b":1,"num":1,"shift":1,"meta":1,"alt":1,"pause":1,"caps":1,"esc":1,
    "pageup":1,"pagedown":1,"end":1,"home":1,
    "left":1,"up":1,"right":1,"down":1,
    "print":1,"insert":1,"delete":1,"cmd":1,
    "f1":1,"f2":1,"f3":1,"f4":1,"f5":1,"f6":1,"f7":1,"f8":1,"f9":1,"f10":1,"f11":1,"f12":1,
    "scroll":1,"ctrl":1,
}




/***/ }),
/* 3 */
/*!**********************!*\
  !*** external "gem" ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/*!****************************!*\
  !*** external "gem/Style" ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/*!***************************!*\
  !*** external "gem/Text" ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=TextEditor.umd.js.map