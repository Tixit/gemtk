window["gem/Style"]=Gem.Style;window["gem/Block"]=Gem.Block;window["gem/Button"]=Gem.Button;window["gem/Canvas"]=Gem.Canvas;window["gem/CheckBox"]=Gem.CheckBox;window["gem/Image"]=Gem.Image;window["gem/List"]=Gem.List;window["gem/Radio"]=Gem.Radio;window["gem/Select"]=Gem.Select;window["gem/Svg"]=Gem.Svg;window["gem/Table"]=Gem.Table;window["gem/Text"]=Gem.Text;window["gem/TextArea"]=Gem.TextArea;window["gem/TextField"]=Gem.TextField;window.gem=Gem;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("proto"), require("gem"), require("gem/Style"));
	else if(typeof define === 'function' && define.amd)
		define(["proto", "gem", "gem/Style"], factory);
	else if(typeof exports === 'object')
		exports["Option"] = factory(require("proto"), require("gem"), require("gem/Style"));
	else
		root["Option"] = factory(root["proto"], root["gem"], root["gem/Style"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/*!*******************!*\
  !*** ./Option.js ***!
  \*******************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// note: this is  not intended to be used directly - only through Combobox, or other

var proto = __webpack_require__(/*! proto */ 1)

var Gem = __webpack_require__(/*! gem */ 2)
var Style = __webpack_require__(/*! gem/Style */ 3)

// emits a 'change' event when its 'selected' value changes
module.exports = proto(Gem, function(superclass) {

    // staic members

    this.name = 'Option'

    this.defaultStyle = Style({
        display: 'block',
        cursor: 'pointer'
    })


    // instance members

    this.init = function(/*[label,] value*/) {
        this.domNode = document.createElement("option") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        superclass.init.call(this) // superclass constructor

        this._selected = false

        if(arguments.length===1) {
            this.val = arguments[0]
        } else { // 2
            this.label = arguments[0]
            this.val = arguments[1]
        }
    }

    Object.defineProperty(this, 'val', {
        // returns the value of the Option
        get: function() {
            return this._value
        },

        // sets the value of the Option
        set: function(value) {
            if(this.parent !== undefined) {
                if(this.parent.mainGem.options[value] !== undefined) {
                    throw new Error("Can't give an Option the same value as another in the Select or MultiSelect (value: "+JSON.stringify(value)+")")
                }

                if(this.val !== null) {
                    delete this.parent.mainGem.options[this.val]
                }

                this.parent.mainGem.options[value] = this
            }

            this._value = value

        }
    })


    Object.defineProperty(this, 'selected', {
        // returns whether or not the option is selected
        get: function() {
            return this._selected
        },

        // sets the selected state of the option to the passed value (true for selected)
        set: function(value) {
            var booleanValue = value === true
            if(this._selected === booleanValue) return false; // ignore if there's no change

            if(this.parent !== undefined)
                this.parent.mainGem.prepareForValueChange([this.val])

            this.setSelectedQuiet(booleanValue)

            if(this.parent !== undefined) {
                this.parent.mainGem.changeValue(this.val)
                this.parent.mainGem.emit('change')
            }
        }
    })


    // private

    // does everything for setting the selected state except emit the parent's change event
    this.setSelectedQuiet = function(booleanValue) {
        if(this.selected === booleanValue) return; // ignore if there's no change

        this._selected = booleanValue
        this.emit('change')
    }
})

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
/*!**********************!*\
  !*** external "gem" ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/*!****************************!*\
  !*** external "gem/Style" ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=Option.umd.js.map