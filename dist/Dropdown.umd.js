window["gem/Style"]=Gem.Style;window["gem/Block"]=Gem.Block;window["gem/Button"]=Gem.Button;window["gem/Canvas"]=Gem.Canvas;window["gem/CheckBox"]=Gem.CheckBox;window["gem/Image"]=Gem.Image;window["gem/List"]=Gem.List;window["gem/Radio"]=Gem.Radio;window["gem/Select"]=Gem.Select;window["gem/Svg"]=Gem.Svg;window["gem/Table"]=Gem.Table;window["gem/Text"]=Gem.Text;window["gem/TextArea"]=Gem.TextArea;window["gem/TextField"]=Gem.TextField;window.gem=Gem;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("proto"), require("gem/Style"), require("gem"), require("gem/Block"));
	else if(typeof define === 'function' && define.amd)
		define(["proto", "gem/Style", "gem", "gem/Block"], factory);
	else if(typeof exports === 'object')
		exports["Dropdown"] = factory(require("proto"), require("gem/Style"), require("gem"), require("gem/Block"));
	else
		root["Dropdown"] = factory(root["proto"], root["gem/Style"], root["gem"], root["gem/Block"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** external "proto" ***!
  \************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/*!****************************!*\
  !*** external "gem/Style" ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/*!**************************************************************!*\
  !*** ./node_modules/gem/src/node_modules/blockStyleUtils.js ***!
  \**************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// some functionality that is needed by Gem.js but is related to styling (some things are also needed by Style.js)

var HashMap = __webpack_require__(/*! hashmap */ 3)

var Style = __webpack_require__(/*! ./Style */ 9)
var utils = __webpack_require__(/*! ./utils */ 4)

var defaultStyleMap = new HashMap() // maps from a proto class to its computed default style
var computedStyles = new HashMap() // stores a map from styleMap components, to the combined style map


// gets the right style from the styleMap, depending on the gem's `name` and `label` (`label` styles take precedence)
// takes the component's inheritance tree into account (relies on the gem.constructor.parent property)
var getStyleMapEntryForGem = exports.getStyleForComponent = function (styleMap, gem) {
    if(styleMap === undefined)
        return undefined

    return getStyleForLabel(styleMap, gem) || getStyleForGemName(styleMap, gem)
}

var getStyleForLabel = exports.getStyleForLabel = function(styleMap, gem) {
    if(gem.label !== undefined && '$'+gem.label in styleMap) {
        return styleMap['$'+gem.label]
    }
}
var getStyleForGemName = exports.getStyleForBlockName = function(styleMap, gem) {
    var constructor = gem.constructor
    while(constructor !== undefined) {
        var style = styleMap[constructor.name]
        if(style !== undefined) {
            return style
        } else {
            constructor = constructor.parent
        }
    }
}

// gets the possibly inheriting style from the styleMap for `gem`
// gem - the gem to get the style for
// ancestor - the gem to get the computedStyleMap from
var getInheritingStyle = exports.getInheritingStyle = function(gem) {
    var ancestor = gem.parent
    if(ancestor === undefined || ancestor.computedStyleMap === undefined) return undefined

    if(gem.label !== undefined) {
        var styleMapKey = '$'+gem.label
        var nextContructor = gem.constructor
    } else {
        var styleMapKey = gem.constructor.name
        var nextContructor = gem.constructor.parent
    }

    var nextAncestorToSearchFrom = ancestor
    var styles = [], inherit = true
    while(nextAncestorToSearchFrom !== undefined) {    // find styles from the most specific name to the least specific
        var stylesForKey = findStylesForStyleMapKey(nextAncestorToSearchFrom, styleMapKey)
        styles = styles.concat(stylesForKey.styles)
        nextAncestorToSearchFrom = stylesForKey.nextAncestorToSearchFrom
        inherit = stylesForKey.inherit

        if(nextContructor === undefined || !inherit) {
            break
        } else {
            if(styleMapKey === 'Gem') {
                break // we're done - no need to check anything higher in the prototype chain than Gem
            }

            styleMapKey = nextContructor.name
            nextContructor = nextContructor.parent
        }
    }

    var reversedStyles = styles.reverse() // reverse so later styles override earlier styles
    var styleToReturn = reversedStyles[0]
    for(var n=1; n<reversedStyles.length; n++) {
        styleToReturn = styleToReturn.mix(reversedStyles[n], false)
    }

    return styleToReturn


    function findStylesForStyleMapKey(startAncestor, key) {
        var styles = [], inherit = true
        var curAncestor = startAncestor, nextAncestorToSearchFrom = startAncestor
        while(curAncestor !== undefined) {                                // find styles from the closest parent to the farthest
            if(curAncestor.computedStyleMap !== undefined) {
                var style = curAncestor.computedStyleMap[key]
            }
            if(style !== undefined) {
                if(styles.indexOf(style) === -1) {
                    styles.push(style)
                }
                nextAncestorToSearchFrom = curAncestor

                inherit = style.inherit
                if(!inherit) {
                    break
                }
            }

            curAncestor = curAncestor.parent
        }

        return {styles:styles, nextAncestorToSearchFrom: nextAncestorToSearchFrom, inherit:inherit}
    }
}

// returns the conjunction of two style maps
// gets it from the computedStyles cache if its already in there
var styleMapConjunction = exports.styleMapConjunction = function (secondaryStyleMap, primaryStyleMap) {
    if(secondaryStyleMap === undefined) return primaryStyleMap
    if(primaryStyleMap === undefined) return secondaryStyleMap

    var cachedStyleMap = computedStyles.get([secondaryStyleMap, primaryStyleMap])
    if(cachedStyleMap === undefined) {
        if(secondaryStyleMap  === undefined) {
            cachedStyleMap = primaryStyleMap
        } else if(primaryStyleMap === undefined) {
            cachedStyleMap = secondaryStyleMap
        } else {
            var overridingProperties = {}, atLeastOne = false
            for(var key in primaryStyleMap) {
                if(secondaryStyleMap[key] !== primaryStyleMap[key]) {
                    overridingProperties[key] = primaryStyleMap[key]
                    atLeastOne = true
                }
            }

            if(atLeastOne) {
                cachedStyleMap = utils.objectConjunction(secondaryStyleMap, overridingProperties)
            } else { // the styleMaps are different objects, but contain the same thing
                cachedStyleMap = secondaryStyleMap
            }
        }

        if(cachedStyleMap === undefined) cachedStyleMap = false // switch it out with false so it can be recognized
        computedStyles.set([secondaryStyleMap, primaryStyleMap], cachedStyleMap)
    }

    if(cachedStyleMap === false) {
        return undefined
    }
    return cachedStyleMap
}



exports.getDefaultStyle = function(gem)  {
    // attempt to get from the cache
    var defaultGemStyle = defaultStyleMap.get(gem.constructor)
    if(defaultGemStyle === undefined) {
        defaultGemStyle = createDefaultGemStyle(gem)
        if(defaultGemStyle === undefined) defaultGemStyle = false
        defaultStyleMap.set(gem.constructor, defaultGemStyle)
    }

    if(defaultGemStyle === false) {
        return undefined
    }
    return defaultGemStyle
}

// returns a new style with style b mixed into style a (works even if they're both undefined)
var mixStyles = exports.mixStyles = function(a,b) {
    if(a === undefined)
        return b
    else
        return a.mix(b, false)
}





// sets the currentStyle of a gem and makes all the appropriate changes to render a new active style for the gem and its children
exports.setCurrentStyle = function(gem, newCurrentStyle, defaultStyle) {

    var current$state = gem._currentStyle === undefined? undefined: gem._currentStyle.stateHandler
    var newCurrentStyle$state = newCurrentStyle === undefined? undefined: newCurrentStyle.stateHandler
    if(current$state !== newCurrentStyle$state) {     // if the $state function remains the same, we don't gotta do nothin (about switching state functions at least)
        if(gem._stateChangeHandler !== undefined) {  // remove the old handler if necessary
            gem.state.removeListener('change', gem._stateChangeHandler)
            gem._stateChangeHandler = undefined
        }

        if(newCurrentStyle$state !== undefined) {     // add a new handler if necessary
            gem.state.on('change', gem._stateChangeHandler = function() {
                var rawStateStyle = getStateStyle(gem._currentStyle, gem.state.subject)
                setMixedStateStyle(gem, mixStyles(gem._currentStyle, rawStateStyle))
            })
        }
    }

    gem._currentStyle = newCurrentStyle
    var rawStateStyle = getStateStyle(newCurrentStyle, gem.state.subject)

    var newMixedStateStyle = mixStyles(newCurrentStyle, rawStateStyle)
    setMixedStateStyle(gem, newMixedStateStyle, defaultStyle)
}


// handles reseting a gem's active style when its state style changes
// renders the pseudoclass style
function setMixedStateStyle(gem, mixedStateStyle, defaultStyle) {
    var psuedoclassState = {}

    // if a pseudoclass can no longer apply, undo its setup
    for(var pseudoClass in gem._styleSetupInfo) {
        if(mixedStateStyle === undefined || !(pseudoClass in mixedStateStyle.pseudoclasses.emulatedInfo)) {
            var setupInfo = gem._styleSetupInfo[pseudoClass]
            setupInfo.kill(gem, setupInfo.state)
            delete gem._styleSetupInfo[pseudoClass]
        }
    }

    // setup new pseudoclasses
    if(mixedStateStyle !== undefined) {
        for(var pseudoClass in mixedStateStyle.pseudoclasses.emulatedInfo) {
            if(!(pseudoClass in gem._styleSetupInfo)) {                     // if this exact pseudoclass is already setup, no need to do anything
                ;(function(pseudoClass, emulationInfo){   // close over those variables (so they keep the value they had when the function was setup)
                    var setupState = emulationInfo.fns.setup(gem, function() { // start
                        var changed = psuedoclassState[pseudoClass] !== true
                        if(changed) {
                            psuedoclassState[pseudoClass] = true
                            changeStyleIfNecessary()
                        }
                    }, function() { // end
                        var changed = psuedoclassState[pseudoClass] !== false
                        if(changed) {
                            psuedoclassState[pseudoClass] = false
                            changeStyleIfNecessary()
                        }
                    }, emulationInfo.parameter)

                    gem._styleSetupInfo[pseudoClass] = {state: setupState, kill: emulationInfo.fns.kill}

                })(pseudoClass, mixedStateStyle.pseudoclasses.emulatedInfo[pseudoClass])
            }
        }
    }

    // build up the pseudoclass state - depending on what pseudoclasses might become applicable
    if(mixedStateStyle !== undefined) {
        for(var pseudoclassKey in mixedStateStyle.pseudoclasses.emulatedInfo) {
            var info = mixedStateStyle.pseudoclasses.emulatedInfo[pseudoclassKey]
            psuedoclassState[pseudoclassKey] = info.fns.check(gem, info.parameter)
        }
    }

    // set current pseudoclass style
    changeStyleIfNecessary()


    function changeStyleIfNecessary() {
        var pseudoclassStyleInfo = getPseudoclassStyleFor(mixedStateStyle, psuedoclassState)
//        if(pseudoclassStyleInfo.style !== undefined && pseudoclassStyleInfo.style.inherit) {
//            pseudoclassStyleInfo.style = getInheritingStyle(gem).mix(pseudoclassStyleInfo.style, false)
//        }

        var newPreStyleMapStyle = mixStyles(mixedStateStyle, pseudoclassStyleInfo.style)
        setPreStyleMapStyle(gem, newPreStyleMapStyle, pseudoclassStyleInfo.index, defaultStyle)
    }
}

// sets the style before being modified by the gem's parent's computedStyleMap
// handles removing the state listener and calling $kill on the old activeStyle
function setPreStyleMapStyle(gem, newPreStyleMapStyle, jsRenderedPseudoclassIndex, defaultStyle) {
    if(gem.parent !== undefined && newPreStyleMapStyle !== undefined)
        var newComputedStyleMap = styleMapConjunction(gem.parent.computedStyleMap, newPreStyleMapStyle.componentStyleMap)
    else if(gem.parent !== undefined)
        var newComputedStyleMap = gem.parent.computedStyleMap
    else if(newPreStyleMapStyle !== undefined)
        var newComputedStyleMap = newPreStyleMapStyle.componentStyleMap
    else
        var newComputedStyleMap = undefined

    var newActiveStyle = undefined // can be changed below
    var cancel = false
    if(newPreStyleMapStyle !== undefined) {
        if(gem.parent !== undefined) var nativePseudoclassMap = gem.parent._nativePseudoclassMap
        else                           var nativePseudoclassMap = {}

        var nativePseudoclassSelectorMap = getStyleMapEntryForGem(nativePseudoclassMap, gem)
        var nativeCssInfo = newPreStyleMapStyle.createNativeCssInfo(gem, newComputedStyleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle)

        if(nativeCssInfo.cancel) {
            cancel = true
            setMixedStateStyle(gem, nativeCssInfo.retryStyle)

        } else {
            newActiveStyle = nativeCssInfo.style
            newComputedStyleMap = nativeCssInfo.styleMap // even newer!
            gem._nativePseudoclassMap = nativeCssInfo.nativePseudoclassMap
        }
    }

    if(!cancel) {
        setActiveStyle(gem, newActiveStyle, newComputedStyleMap)
    }
}

// sets the active style on the gem and on the gem's children
// also sets the gem's new computedStyleMap
function setActiveStyle(gem, newActiveStyle, newComputedStyleMap) {
    var activeStyleChanged = newActiveStyle !== gem._activeStyle
    var computedStyleMapChanged = gem.computedStyleMap !== newComputedStyleMap

    if(activeStyleChanged) {
        setStyleClass(gem, newActiveStyle)

        var curActiveStyle$setup = gem._activeStyle === undefined? undefined: gem._activeStyle.setup
        var newActiveStyle$setup = newActiveStyle === undefined? undefined: newActiveStyle.setup
        if(curActiveStyle$setup !== newActiveStyle$setup) {
            applyStyleKillFunction(gem)
            applyStyleSetupFunction(gem, newActiveStyle)
        }

        gem._activeStyle = newActiveStyle
    }


    gem.computedStyleMap = newComputedStyleMap

    // propogate styles to children
    gem.children.forEach(function(child) {
        if(computedStyleMapChanged || !child.attached) {
            setAttachStatus(child, true)
            child.style = child.style  // force a re-render on each child
        }
    })
}

var setAttachStatus = exports.setAttachStatus = function(node, attached) {
    node.attached = attached
    if(attached) {
        node.emit('attach')
    } else {
        node.emit('detach')
        node.children.forEach(function(child) {
            setAttachStatus(child, false)
        })
    }
}


// given a style and an object representing some state, returns the state given by the style's $state function
// returns undefined if it doesn't have a state function
// handles caching state styles (an optimization)
function getStateStyle(currentStyle, stateParameter) {
    if(currentStyle === undefined || currentStyle.stateHandler === undefined) return undefined

    var returnedStyle = currentStyle.stateHandler(stateParameter)

    // todo: figure out if this style has been returned before, and if so, use the already-generated style (mostly so that that style can take advantage of other cached combinations)

    return returnedStyle
}

// returns an object with the properties:
    // style - the jsRendered pseudoclass style for the gem's relevant pseudoclass state
    // index - the index of the pseudoclass (jsRenderedPseudoclassIndex)
// returns undefined if no emulated pseudoclass style applies or if only native pseudoclass stylings apply
// state - an object that will be mutated with the current state for each pseudoclass
function getPseudoclassStyleFor(style, state) {
    if(style === undefined) return {index:0}

    var index = 0, result={index:0}
    style.pseudoclasses.classes.forEach(function(psuedoclassStyle, compoundKey) {
        if(!psuedoclassStyle.pureNative) {
            for(var j=0; j<compoundKey.length; j++) {
                var pseudoclass = compoundKey[j]
                if(!state[pseudoclass]) {
                    break;
                }
            }

            if(j === compoundKey.length) {
                result = {index: index, style: psuedoclassStyle}
            }
        }

        index++
    })

    return result
}



// finds the default style for a gem, mixes it with the appropriate ancestor styles, and returns the result
function createDefaultGemStyle(that) {
    if(that.defaultStyle !== undefined) {
        var defaultStyle = getStyleObject(that.defaultStyle)
    }

    // get list of default styles
    var defaultStyles = []
    var nextConstructor = that.constructor
    while(nextConstructor !== undefined) {
        if(nextConstructor.defaultStyle !== undefined) {
            defaultStyles.push(nextConstructor.defaultStyle)
        }
        nextConstructor = nextConstructor.parent
    }

    // generate merged default style
    var reversedDefaults = defaultStyles.reverse()
    var mergedDefaultStyle = reversedDefaults[0]
    for(var n=1; n<reversedDefaults.length; n++) {
        mergedDefaultStyle = mergedDefaultStyle.mix(reversedDefaults[n], false)
    }

    return mergedDefaultStyle
}


// applies setup appropriately
function applyStyleSetupFunction(component, style) {
    if(style !== undefined && style.setup !== undefined) {
        component._styleSetupObject = style.setup(component, style) // call setup on the component
    } else {
        component._styleSetupObject = undefined
    }
}
// applies kill appropriately
function applyStyleKillFunction(component) {
    var activeStyle = component._activeStyle
    if(activeStyle !== undefined && activeStyle.setup !== undefined) {
        if(activeStyle.kill === undefined)
            throw new Error('style has been unset but does not have a "kill" function to undo its "setup" function')

        activeStyle.kill(component, component._styleSetupObject)
    }
}


// sets the style, replacing one if one already exists
function setStyleClass(component, style) {
    var activeStyle = component._activeStyle

    //var newStyle = component.domNode.className
    if(activeStyle !== undefined) {
        component.domNode.classList.remove(activeStyle.className)
        // newStyle = newStyle.replace(new RegExp(" ?\\b"+activeStyle.className+"\\b"),'') // remove the previous css class
    }
    if(style !== undefined) {
        component.domNode.classList.add(style.className)
        //newStyle = style.className+' '+newStyle.trim() // note that the order of classes doesn't matter
    }

    //component.domNode.className = newStyle
}

var styleObjectMap = new HashMap // maps javascript object styles to Style objects
var getStyleObject = exports.getStyleObject = function(style) {
    if(isStyleObject(style)) {
        return style
    } else {
        var styleObject = styleObjectMap.get(style)
        if(styleObject) {
            return styleObject
        } else {
            var styleObject = Style(style)
            styleObjectMap.set(style,styleObject)
            return styleObject
        }
    }
}

// if you load two different instances of gems, its necessary to do a bit of duck typing
var isStyleObject = exports.isStyleObject = function (x) {
    return x.className !== undefined && x.componentStyleMap !== undefined && x.mix !== undefined
}

/***/ }),
/* 3 */
/*!*****************************************!*\
  !*** ./node_modules/hashmap/hashmap.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.0.5
 * Homepage: https://github.com/flesler/hashmap
 */

(function(factory) {
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module === 'object') {
		// Node js environment
		var HashMap = module.exports = factory();
		// Keep it backwards compatible
		HashMap.HashMap = HashMap;
	} else {
		// Browser globals (this is window)
		this.HashMap = factory();
	}
}(function() {

	function HashMap(other) {
		this.clear();
		switch (arguments.length) {
			case 0: break;
			case 1: this.copy(other); break;
			default: multi(this, arguments); break;
		}
	}

	var proto = HashMap.prototype = {
		constructor:HashMap,

		get:function(key) {
			var data = this._data[this.hash(key)];
			return data && data[1];
		},

		set:function(key, value) {
			// Store original key as well (for iteration)
			var hash = this.hash(key);
			if ( !(hash in this._data) ) {
				this._count++;
			}
			this._data[hash] = [key, value];
		},

		multi:function() {
			multi(this, arguments);
		},

		copy:function(other) {
			for (var hash in other._data) {
				if ( !(hash in this._data) ) {
					this._count++;
				}
				this._data[hash] = other._data[hash];
			}
		},

		has:function(key) {
			return this.hash(key) in this._data;
		},

		search:function(value) {
			for (var key in this._data) {
				if (this._data[key][1] === value) {
					return this._data[key][0];
				}
			}

			return null;
		},

		remove:function(key) {
			var hash = this.hash(key);
			if ( hash in this._data ) {
				this._count--;
				delete this._data[hash];
			}
		},

		type:function(key) {
			var str = Object.prototype.toString.call(key);
			var type = str.slice(8, -1).toLowerCase();
			// Some browsers yield DOMWindow for null and undefined, works fine on Node
			if (type === 'domwindow' && !key) {
				return key + '';
			}
			return type;
		},

		keys:function() {
			var keys = [];
			this.forEach(function(_, key) { keys.push(key); });
			return keys;
		},

		values:function() {
			var values = [];
			this.forEach(function(value) { values.push(value); });
			return values;
		},

		count:function() {
			return this._count;
		},

		clear:function() {
			// TODO: Would Object.create(null) make any difference
			this._data = {};
			this._count = 0;
		},

		clone:function() {
			return new HashMap(this);
		},

		hash:function(key) {
			switch (this.type(key)) {
				case 'undefined':
				case 'null':
				case 'boolean':
				case 'number':
				case 'regexp':
					return key + '';

				case 'date':
					return '♣' + key.getTime();

				case 'string':
					return '♠' + key;

				case 'array':
					var hashes = [];
					for (var i = 0; i < key.length; i++) {
						hashes[i] = this.hash(key[i]);
					}
					return '♥' + hashes.join('⁞');

				default:
					// TODO: Don't use expandos when Object.defineProperty is not available?
					if (!key.hasOwnProperty('_hmuid_')) {
						key._hmuid_ = ++HashMap.uid;
						hide(key, '_hmuid_');
					}

					return '♦' + key._hmuid_;
			}
		},

		forEach:function(func, ctx) {
			for (var key in this._data) {
				var data = this._data[key];
				func.call(ctx || this, data[1], data[0]);
			}
		}
	};

	HashMap.uid = 0;

	//- Add chaining to some methods
    var chainMethod = {set:1,multi:1,copy:1,remove:1,clear:1,forEach:1}
	for (var method in chainMethod) {
		proto[method] = chain(proto[method])
	}

	//- Utils

	function multi(map, args) {
		for (var i = 0; i < args.length; i += 2) {
			map.set(args[i], args[i+1]);
		}
	}

	function chain(fn) {
		return function() {
			fn.apply(this, arguments);
			return this;
		};
	}

	function hide(obj, prop) {
		// Make non iterable if supported
		if (Object.defineProperty) {
			Object.defineProperty(obj, prop, {enumerable:false});
		}
	}

	return HashMap;
}));


/***/ }),
/* 4 */
/*!****************************************************!*\
  !*** ./node_modules/gem/src/node_modules/utils.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

//require('hashmap') // here to mark hashmapMerge's dependency on this module
var path = __webpack_require__(/*! path */ 11)


// Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
// any number of objects can be passed into the function and will be merged into the first argument in order
// returns obj1 (now mutated)
var merge = exports.merge = function(obj1, obj2/*, moreObjects...*/){
    return mergeInternal(arrayify(arguments), false)
}

// like merge, but traverses the whole object tree
// the result is undefined for objects with circular references
var deepMerge = exports.deepMerge = function(obj1, obj2/*, moreObjects...*/) {
    return mergeInternal(arrayify(arguments), true)
}

// merges two hashmaps together just like merge does for regular objects
// non-deep merge
exports.hashmapMerge = function(obj1, obj2/*, moreObjects...*/) {
    obj2.forEach(function(value, key) {
        obj1.set(key, obj2.get(key))
    })

    if(arguments.length > 2) {
        var newObjects = [obj1].concat(Array.prototype.slice.call(arguments, 2))
        return exports.hashmapMerge.apply(this, newObjects)
    } else {
        return obj1
    }
}

// returns a new object where properties of b are merged onto a (a's properties may be overwritten)
exports.objectConjunction = function(a, b) {
    var objectCopy = {}
    merge(objectCopy, a)
    merge(objectCopy, b)
    return objectCopy
}

// turns an array of values into a an object where those values are all keys that point to 'true'
exports.arrayToMap = function(array) {
    var result = {}
    array.forEach(function(v) {
        result[v] = true
    })
    return result
}

function mergeInternal(objects, deep) {
    var obj1 = objects[0]
    var obj2 = objects[1]

    for(var key in obj2){
       //if(Object.hasOwnProperty.call(obj2, key)) {
            if(deep && obj1[key] instanceof Object && obj2[key] instanceof Object) {
                mergeInternal([obj1[key], obj2[key]], true)
            } else {
                obj1[key] = obj2[key]
            }
       //}
    }

    if(objects.length > 2) {
        var newObjects = [obj1].concat(objects.slice(2))
        return mergeInternal(newObjects, deep)
    } else {
        return obj1
    }
}


function arrayify(a) {
    return Array.prototype.slice.call(a, 0)
}


/***/ }),
/* 5 */
/*!*********************!*\
  !*** ./Dropdown.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! gem */ 6)
var Style = __webpack_require__(/*! gem/Style */ 1)
var Block = __webpack_require__(/*! gem/Block */ 7)

var utils = __webpack_require__(/*! ./utils */ 8)

var scrollStyle = Style({
    overflowY: 'scroll' // // overflow:auto doesn't work right for some godawful stupid css reason - http://stackoverflow.com/questions/32148519/widthauto-not-working-right-for-absolutely-positioned-div-when-scroll-bar-is-pr#32148618
})

// A button that can open and close a custom dropdown component
// emits:
    // open - emitted when the dropdown is opened
    // close - emitted when the dropdown is closed
// states:
    // direction - Vertical direction. Can either be 1 or -1. 1 means the menu is displayed below its button, -1 means the menu is displayed above its button.
    // horizontalDirection - Either 1 or -1. 1 means the menu extends beyond the right side of the button, -1 means the menu extends beyond the left side of the button.
    // height - Can either be undefined, or a number. If undefined, it means the height is not constrained. If defined, it gives the height in pixels the menu is constrained to.
    // width - Can either be undefined, or a number. If undefined, it means the width is not constrained. If defined, it gives the width in pixels the menu is constrained to.
// note that in styling this, you can style the menu (using $menu, or its gem selector) as if it were an actual child
module.exports = proto(Gem, function(superclass) {
    this.name = 'Dropdown'

    // can be overridden for different default menu styles
    this.dropdownMenuStyle = Style({
        display: 'block',
        position: 'absolute',
        border: '1px solid black',
        marginTop: 2,
        padding: 2,
        backgroundColor: 'white',
        zIndex: 1000, // note: this may need to be changed if you use z-indexes in your application

        $state: function(state) {
            if(state.height !== undefined) {
                return scrollStyle
            }
        }
    })

    this.defaultStyle = Style({
        $setup: function(block, style) {
            var standaloneMenuStyle = utils.getStandaloneStyle(block, block.dropdown, style)
            var fullstandAloneMenuStyle = block.dropdownMenuStyle.mix(standaloneMenuStyle)
            block.dropdown.style = fullstandAloneMenuStyle
        },
        $kill: function(block) {
            block.dropdown.style = undefined
        },

        $wrapper: {
            display: 'block',
            position: 'static'
        }
    })

    // dropdown - The component to display when the Dropdown is opened. Note that this is mutated by being given the label 'menu'
        // dropdown.state:direction - set to either 1 if the menu is displayed below the button, and -1 if the menu is displayed above the button
        // dropdown.state:height - set to the height of the dropdown if the height  needs to be constrained, undefined if it doesn't need to be constrained (this is useful to do things like set 'overflow' to 'scroll' for example)
        // dropdown.getPotentialHeight() - (optional) If available, called to get the full potential height of the dropdown. If not available, defaults to the dropdown's scrollHeight
    // maintainDropdownPosition - (default:true) If true, while the dropdown is open, it will be repositioned constantly so that it tracks the movement of the button Component
    this.build = function(/*[label,]button, dropdown[, maintainDropdownPosition]*/) {
        if(arguments[0] === undefined || typeof(arguments[0]) === 'string') {
            var label = arguments[0]
            var argn = 1
        } else {
            var argn = 0
        }

        this.button = arguments[argn]
        this.menu = this.dropdown = arguments[argn+1] // this.dropdown is deprecated
        this.maintainDropdownPosition = arguments[argn+2]
        if(this.maintainDropdownPosition === undefined) {
            this.maintainDropdownPosition = true
        }

        this.label = label
        this.isOpen = false

        this.menu.label = 'menu'
        this.menu.domNode.style.position = 'absolute'

        this.button.label = 'button'

        this.add(this.button) // Block('wrapper', [buttonComponent/*, dropdown])) // wrap it in a container to get around weirdness with parents that have css overflow auto/hidden
    }

    this.close = function() {
        if(this.isOpen) {
            this.isOpen = false
            this.menu.detach()
            //this.menu.visible = false
            if(this.interval !== undefined) {
                clearInterval(this.interval)
            }

            this.emit('close')
        }
    }

    this.open = function() {
        if(!this.isOpen) {
            this.isOpen = true

            var that = this

            // find the closest component that can obscure the buttonComponent if it scrolls them above its boundaries
            var overflowView = utils.findOverflowView(this.domNode, 'y')
            var overflowViewBoundary = overflowView.getBoundingClientRect()

            // menu positioning
            //repositionMenu(that, overflowViewBoundary, true)  // i guess we don't need this, and it was causing annoying flicker
            if(this.maintainDropdownPosition) {
                // only reposition (and make visible) the menu after a return back to the scheduler, cause otherwise it doesn't take the explicit styles into account for some reason
                this.interval = setInterval(function() {
                    repositionMenu(that, overflowViewBoundary)
                },50)
            } else {
                // only reposition (and make visible) the menu after a return back to the scheduler, cause otherwise it doesn't take the explicit styles into account for some reason
                setTimeout(function() {
                    repositionMenu(that, overflowViewBoundary)
                },50)
            }

            that.menu.attach()  // attach at the top level so it isn't confined to the boundaries of its parents
            that.emit('open')
        }
    }

    this.toggle = function() {
        if(this.isOpen) {
            this.close()
        } else {
            this.open()
        }
    }
})

// repositions the dropdown component according to where the button component is on the page
// overflowViewBoundary -  the boundingClientRect of the block who's boundaries can obscure the buttonComponent
function repositionMenu(that, overflowViewBoundary, firstRepositioning) {
    var buffer = 1 // some distance the menu is from the button (not sure why its there, but this helps work around it)

    var buttonBounds = that.domNode.getBoundingClientRect()
    var dropdown = that.menu

    if(buttonBounds.bottom > overflowViewBoundary.top && buttonBounds.top < overflowViewBoundary.bottom    // make sure the button is still visible
       && buttonBounds.right > overflowViewBoundary.left && buttonBounds.left < overflowViewBoundary.right
    ) {
        var dropdownStyle = getComputedStyle(that.menu.domNode) // is this expensive? Maybe store it as a property on 'that'?

        setDimensionAndPosition('v', dropdown, dropdownStyle,buttonBounds, firstRepositioning)
        setDimensionAndPosition('h', dropdown, dropdownStyle,buttonBounds, firstRepositioning)
//        dropdown.domNode.style.left = buttonBounds.left+'px'
        dropdown.visible = true
    } else  {
        that.menu.visible = false
    }
}

// sets either the height and vertical position or the width and horizontal position, depending on the arguments
// type - Either "v" or "h"
// dropdown - The dropdown gem
// dropdownStyle - A result from getComputedStyle(node)
// buttonBounds - The BoundingClientRect of the button
function setDimensionAndPosition(type, dropdown, dropdownStyle, buttonBounds, firstPositioning) {
    if(type === 'v') {
        var lower = 'bottom'
        var upper = 'top'
        var dimension = 'height'
        var directionName = 'direction'

        var potentialDimension = 'getPotentialHeight'
        var scrollDimension = 'scrollHeight'
        var clientDimension = 'clientHeight'
    } else {
        var lower = 'right'
        var upper = 'left'
        var dimension = 'width'
        var directionName = 'horizontalDirection'

        var potentialDimension = 'getPotentialWidth'
        var scrollDimension = 'scrollWidth'
        var clientDimension = 'clientWidth'
    }

    if(type === 'v') {
        var upperOffset = buttonBounds[upper]
        var lowerOffset = buttonBounds[lower]
        var buffer = 1 // some distance the menu is from the button (not sure why its there, but this helps work around it)
    } else {
        // these are switched because in the normal case, the dropdown should be pushed right to the distance of the *left* boundary of the button (and vice versa)
        var upperOffset = buttonBounds[lower]
        var lowerOffset = buttonBounds[upper]
        var buffer = 0
    }

    var dropdownMarginUpper = utils.getStylePxAmount(dropdownStyle, 'margin-'+upper)
    var dropdownMarginLower = utils.getStylePxAmount(dropdownStyle, 'margin-'+lower)

    var dropdownMargins = dropdownMarginUpper + dropdownMarginLower

    if(dropdown[potentialDimension] !== undefined) {
        var dropdownDimension = dropdown[potentialDimension]()
    } else {
        var dropdownDimension = dropdown.domNode[scrollDimension]
    }

    var amountCutOffDownward = lowerOffset + dropdownDimension + dropdownMargins - document.documentElement[clientDimension]
    var amountCutOffUpward = dropdownDimension + dropdownMargins - upperOffset

    if(amountCutOffDownward < 0) { // if its visible by being displayed underneath
        var direction = 1
        var newUpper = lowerOffset-buffer
    } else if(amountCutOffUpward < 0) {  // if its only visible by being displayed upward
        var direction = -1
        var newUpper = upperOffset-dropdownDimension+buffer // puts it above rather than below - note that dropdownDimension should be the same as the clientHeight *after* this function runs (which is what we care about here)
    } else {
        if(amountCutOffDownward < amountCutOffUpward) { // if you can see more of the dropdown by opening it downward
            var direction = 1
            var newDimension = dropdownDimension+dropdownMarginLower - amountCutOffDownward
            var newUpper = lowerOffset-buffer
        } else {
            var direction = -1
            var newDimension = dropdownDimension+dropdownMarginUpper - amountCutOffUpward
            var newUpper = newDimension-upperOffset+buffer
        }
    }

    dropdown.domNode.style[upper] = newUpper+'px'
    if(newDimension !== undefined) {
        if(firstPositioning || dropdown.state.subject[dimension] !== newDimension) {
            dropdown.domNode.style[dimension] = newDimension+'px'
            dropdown.state.set(dimension, newDimension)
        }
    } else {
        if(firstPositioning || dropdown.state.subject[dimension] !== undefined) {
            dropdown.domNode.style[dimension] = ''
            dropdown.state.set(dimension, undefined)
        }
    }

    if(firstPositioning || dropdown.state.subject[directionName] !== direction) {  // don't constantly reset things if they're already that value
        dropdown.state.set(directionName, direction)
    }
}


/***/ }),
/* 6 */
/*!**********************!*\
  !*** external "gem" ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/*!****************************!*\
  !*** external "gem/Block" ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var Style = __webpack_require__(/*! gem/Style */ 1)
var gemStyleUtils = __webpack_require__(/*! ./node_modules/gem/src/node_modules/blockStyleUtils */ 2)

// Gem Utils

// returns a style that can be applied to 'gem' so that 'gem' will get styled as if it were a child of 'pseudoparent'
exports.getStandaloneStyle = function(psuedoparent, gem, pseudoparentStyle) {
    var standaloneStyle = gemStyleUtils.getStyleForComponent(pseudoparentStyle.componentStyleMap, gem)
    if(standaloneStyle) {
        standaloneStyle = standaloneStyle.copy()
    } else {
        standaloneStyle = Style({})
    }

    // give it the full computed style map it would have it were an actual child
    var original = standaloneStyle.componentStyleMap
    standaloneStyle.componentStyleMap = {}
    if(psuedoparent.parent !== undefined)
        merge(standaloneStyle.componentStyleMap, psuedoparent.parent.computedStyleMap)
    merge(standaloneStyle.componentStyleMap, pseudoparentStyle.componentStyleMap, original)

    return standaloneStyle
}

// Gem Style Utils

// Dom Utils

// style - an object returned from getComputedStyle
// property - a css property
exports.getStylePxAmount = function(style, property) {
    var text = style.getPropertyValue(property)
    return parseInt(text.slice(0,text.length-2), 10)
}

// returns the closest ancestor dom node that has a non-visible scroll type for the given axis
// axis - either 'x' or 'y'
exports.findOverflowView = function(domNode, axis) {
    for(var overflowView = domNode.parentNode; overflowView !== null; overflowView = overflowView.parentNode) {
        var overflowStyle = window.getComputedStyle(overflowView).getPropertyValue('overflow-'+axis)
        if(overflowView.parentNode === document || (overflowStyle !== 'visible' && overflowStyle !== '')) {
            break;
        }
    }
    return overflowView
}

// returns true if the point intersects the element's bounds, false otherwise
exports.isPointOver = function(x,y, element) {
    var bounds = element.getBoundingClientRect()
    return bounds.top <= y&&y <= bounds.bottom
        && bounds.left <= x&&x <= bounds.right
}

// Misc

// Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
// any number of objects can be passed into the function and will be merged into the first argument in order
// returns obj1 (now mutated)
function merge(obj1, obj2/*, moreObjects...*/){
    return mergeInternal(arrayify(arguments), false)
}

function mergeInternal(objects, deep) {
    var obj1 = objects[0]
    var obj2 = objects[1]

    for(var key in obj2){
       if(Object.hasOwnProperty.call(obj2, key)) {
            if(deep && obj1[key] instanceof Object && obj2[key] instanceof Object) {
                mergeInternal([obj1[key], obj2[key]], true)
            } else {
                obj1[key] = obj2[key]
            }
       }
    }

    if(objects.length > 2) {
        var newObjects = [obj1].concat(objects.slice(2))
        return mergeInternal(newObjects, deep)
    } else {
        return obj1
    }
}

function arrayify(a) {
    return Array.prototype.slice.call(a, 0)
}

/***/ }),
/* 9 */
/*!****************************************************!*\
  !*** ./node_modules/gem/src/node_modules/Style.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var jssModule = __webpack_require__(/*! ../external/jss */ 10)
var proto = __webpack_require__(/*! proto */ 0)
var HashMap = __webpack_require__(/*! hashmap */ 3)

var utils = __webpack_require__(/*! ./utils */ 4)

var baseClassName = '_ComponentStyle_' // the base name for generated class names
var nextClassNumber = 0


var mixedStyles = new HashMap() // maps from a pair of Style objects to the resulting mixed style

// creates a style object
var Style = module.exports = proto(function() {

    // static properties

    // transforms the output of Style.toString() back into a Style object
    this.fromString = function(styleString, context) {
        if(context === undefined) context = {}
        var obj = JSON.parse(styleString)

        var transformFunctionStringsToFunctions = function(obj) {
            for(var p in obj) {
                var x = obj[p]
                if(x instanceof Object) {
                    transformFunctionStringsToFunctions(x)
                } else if(typeof(x) === 'string' && x.substr(0,8) === 'function') {
                    if(context.Style === undefined) {
                        context.Style = Style
                    }

                    var keys=[], values=[]
                    for(var key in context) {
                        keys.push(key)
                        values.push(context[key])
                    }

                    obj[p] = Function(keys, 'return '+x).apply(undefined, values)
                }
            }
        }

        transformFunctionStringsToFunctions(obj)

        return Style(obj)
    }

    // instance properties

    this.defaultClassName = '_default_'     // the name of the default class (used to prevent style inheritance)

    // styleDefinition is an object where key-value pairs can be any of the following:
    // <cssPropertyName>: the value should be a valid css value for that style attribute
    // <ComponentName>: the value can either be a Style object or a nested styleDefinition object
    // $setup: the value is a function to be run on a component when the style is applied to it
    // $kill: the value is a function to be run on a component when a style is removed from it
    // $state: the value should be a state handler function
    // $<label>: the value should be a nested styleDefinition object that does not contain any label styles.
    // $inherit: this style should inherit from whatever style would otherwise have been in its placed if it was undefined
    this.init = function(styleDefinition, privateOptions) {
        if(isStyleObject(styleDefinition))
            return styleDefinition
        // else

        if(privateOptions === undefined) privateOptions = {}

        this.className = baseClassName+nextClassNumber
        nextClassNumber++

        this.componentStyleMap = {}
        this.nativeCssInfoCache = new HashMap
//        this.pureStyleInteractionCache = new HashMap
        this.nativePseudoclassesWritten = {}
        this.basicProperties = {}
        if(Style.isDev()) this.nativePseudoclassStyles = {}

        var flatPseudoClassStyles = new HashMap
        for(var key in styleDefinition) {
            var value = styleDefinition[key]

            if(key === '$setup') {
                if(!(value instanceof Function)) throw new Error("$setup key must be a function ('setup' can't be used as a label)")
                this.setup = value

            } else if(key === '$kill') {
                if(!(value instanceof Function)) throw new Error("$kill key must be a function ('kill' can't be used as a label)")
                this.kill = value

            } else if(key === '$state') {
                if(!(value instanceof Function)) throw new Error("$state key must be a function ('$state' can't be used as a label)")
                this.stateHandler = value

            } else if(key === '$inherit') {
                this.inherit = true

            } else if(key.indexOf('$$') === 0) { // pseudo-class style
                var parts = getPseudoClassParts(key.substr(2))
                var pseudoClass = mapCamelCase(parts.class)
                if(parts.parameter !== undefined) {
                    pseudoClass+='('+parts.parameter+")"
                }

                if(pseudoClass === '') {
                    throw new Error("Empty pseudo-class name not valid (style key '$$')")
                }

                var flattenedPseudoclassObject = flattenPseudoClassStyles([pseudoClass], Style(value))

                // mix in the resulting compound pseudoclass styles with what has already been found
                flattenedPseudoclassObject.forEach(function(style, key) {
                    styleHashmapMerge(flatPseudoClassStyles, key, style)
                })

            } else if(key === '$') {
                throw new Error("Empty label name not valid (style key '$')")
            } else if(value instanceof Object || isStyleObject(value)) {  // $label or Gem style
                this.componentStyleMap[key] = Style(value)  // turn the object description into a full fledged style object (or pass back the object if its already a Style)
            } else if(value === undefined) {
                // ignore
            } else {
                var cssStyle = key
                var cssStyleName = mapCamelCase(cssStyle)
                this.basicProperties[cssStyleName] = cssValue(cssStyleName, value)
            }
        }

        this.pseudoclasses = processFlattenedPseudoclasses(flatPseudoClassStyles, this.componentStyleMap)
        this.pureNative = isPureNative(this)


        // takes in a list of pseudoClassRules and changes any nesting like {$$hover: {$$focus: {}}} into something like {hover: {}, ['hover','focus']: {}}
        // returns a new HashMap where
            // each key is the list of pseudoclasses that need to apply for that style to take effect, and
            // each value is a Style object
        // also does some validation
        // pseudoClasses - an array of pseudoclasses
        // pseudoClassStyle - a Style object representing the style inside the pseudoclass
        function flattenPseudoClassStyles(pseudoClasses, pseudoClassStyle) {

            if(pseudoClassStyle.stateHandler !== undefined) {
                throw new Error('$state style functions are not valid directly inside psuedoclasses')
            }

            var flattenedStyles = new HashMap
            var pseudoClassStyleCopy = pseudoClassStyle.copy() // copy so you're not clobbering a style something else relies on

            var pseudoclasses = pseudoClassStyleCopy.pseudoclasses

            // remove the pseudoclasses
            pseudoClassStyleCopy.pseudoclasses = {classes:new HashMap,emulatedInfo:{}}//{native:new HashMap,emulated:new HashMap,emulatedInfo:{}, emulatedOrder:[]}

            // write the top-level pseudoClass
            flattenedStyles.set(pseudoClasses, pseudoClassStyleCopy)

            // create flattened styles (with merged in styles from its parent pseudoclass

            pseudoclasses.classes.forEach(function(substyle, subPseudoClass){
                var newCompoundSelector = canonicalizeCompoundPseudoclass(pseudoClasses.concat(subPseudoClass))
                var mixedStyle = pseudoClassStyleCopy.mix(substyle, false)
                flattenedStyles.set(newCompoundSelector, mixedStyle)
            })

            return flattenedStyles
        }

        // pseudoclassList - the list of pseudoclasses that make up the key
        // mutates pseudoclassList into a canonicalized list
        function canonicalizeCompoundPseudoclass(pseudoclassList) {
            pseudoclassList.sort()  // some string sort to canonicalize the list of pseudoclasses (not really important how it sorts exactly, just that its consistent)

            // remove duplicates
            var lastKey = pseudoclassList[0]
            for(var n=1; n<pseudoclassList.length;) {
                if(pseudoclassList[n] === lastKey) {
                    pseudoclassList.splice(n,1)
                } else {
                    n++
                }
            }

            return pseudoclassList
        }


        // merges two hashmaps together, where if the same key is set in both hashmaps, the values (being Style objects) are mixed together (styles in b overriding)
        // mutates map
        function styleHashmapMerge(map, newKey, newStyle) {
            if(map.has(newKey)) {
                var valueToSet = map.get(newKey).mix(newStyle, false)
            } else {
                var valueToSet = newStyle
            }

            map.set(newKey, valueToSet)
        }

        // returns an object containing the following properties
            // classes - a hashmap object
                // each key is a canonicalized array of pseudoclasses for only emulatable pseudoclasses, and
                // each value is a Style object
            // emulatedInfo - an object where
                // each key is an individual psuedoclass selector (like the elements in a canonicalized pseudoclass list), and
                // each value is an object containing the properties:
                    // fns - the emulated psuedoclass functions `check`, `setup`, and `kill`
                    // parameter - the psuedoclass parameter to pass into `check` and `setup`
        // compoundPseudoClassStyles - a hashmap where
            // each key is a canonicalized array of pseudoclasses, and
            // each value is a Style object
        function processFlattenedPseudoclasses(compoundPseudoClassStyles, componentStyleMap) {

            var pseudoclasses = new HashMap
            compoundPseudoClassStyles.forEach(function(pseudoclassStyle, key) {
                if(pseudoclassStyle.pureNative) {
                    // make sure the pseudoclasses are all natively renderable (any js-rendered pseudoclass that isn't marked 'emulated' is not natively emulatable)
                    var allEmulated = true
                    for(var n=0; n<key.length; n++) {
                        var parts = getPseudoClassParts(key[n])
                        var psuedoclassInfo = jsRenderedPseduoclasses[parts.class]
                        if(psuedoclassInfo !== undefined && !psuedoclassInfo.emulated) {
                            allEmulated = false
                            break
                        }
                    }

                    var componentStyleMapConflicts = false
                    if(allEmulated) {
                        componentStyleMapConflicts = styleMapConflicts(componentStyleMap, pseudoclassStyle.componentStyleMap)
                    }

                    pseudoclassStyle.pureNative = allEmulated && !componentStyleMapConflicts
                }

                for(var n=0; n<key.length; n++) {
                    var parts = getPseudoClassParts(key[n])
                    var psuedoclassInfo = jsRenderedPseduoclasses[parts.class]
                    if(psuedoclassInfo !== undefined && psuedoclassInfo.parameterTransform !== undefined) {
                        var transformedParameter = psuedoclassInfo.parameterTransform(parts.parameter)
                        key[n] = parts.class+"("+transformedParameter+")"
                    }
                }

                pseudoclasses.set(key, pseudoclassStyle)
            })

            var emulatedInfo={}
            pseudoclasses.forEach(function(pseudoclassStyle,individualPseudoclasses) {
                if(!pseudoclassStyle.pureNative) {
                    individualPseudoclasses.forEach(function(pseudoclass) {
                        if(!(pseudoclass in emulatedInfo)) {
                            emulatedInfo[pseudoclass] = getEmulatedInfo(pseudoclass)
                        }
                    })
                }
            })

            return {classes: pseudoclasses, emulatedInfo:emulatedInfo}
        }
    }

    // returns true if there are any styleMap conflicts, which is when any inner style of pseudoclassStyleMap collides with a non-pure style in mainStyleMap
    function styleMapConflicts(mainStyleMap, pseudoclassStyleMap) {
        for(var blockSelector in mainStyleMap) {
            if(blockSelector in pseudoclassStyleMap) {
                if(!mainStyleMap[blockSelector].pureNative) {
                    return true
                } else {
                    var pseudoclassInnerStyle = pseudoclassStyleMap[blockSelector]
                    if(styleMapConflicts(mainStyleMap, pseudoclassInnerStyle.componentStyleMap)) {
                        return true
                    }

                    var pseudoclassStyles = pseudoclassInnerStyle.pseudoclasses.classes.values()
                    for(var n=0; n<pseudoclassStyles.length; n++) {
                        var pseudoclassStyle = pseudoclassStyles[n]
                        if(styleMapConflicts(mainStyleMap, pseudoclassStyle.componentStyleMap)) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }


    // returns true if there are any styleMap conflicts, which is when any inner style of pseudoclassStyleMap collides with a non-pure style in mainStyleMap
    function styleMapConflicts(mainStyleMap, pseudoclassStyleMap) {
        for(var blockSelector in pseudoclassStyleMap) {
            if(blockSelector in mainStyleMap) {
                if(!mainStyleMap[blockSelector].pureNative) {
                    return true
                }
            }

            var pseudoclassInnerStyle = pseudoclassStyleMap[blockSelector]
            if(styleMapConflicts(mainStyleMap, pseudoclassInnerStyle.componentStyleMap)) {
                return true
            }

            var pseudoclassStyles = pseudoclassInnerStyle.pseudoclasses.classes.values()
            for(var n=0; n<pseudoclassStyles.length; n++) {
                var pseudoclassStyle = pseudoclassStyles[n]
                if(styleMapConflicts(mainStyleMap, pseudoclassStyle.componentStyleMap)) {
                    return true
                }
            }
        }

        return false
    }

    // returns either
        // this style if styleB is undefined, or
        // a new Style object that merges styleB's properties into the current one such that styleB's properties override the current Style's properties
    // mixInherit - (default: true) if false, doesn't mix in the 'inherit' property
    this.mix = function(styleB, mixInherit) {
        if(mixInherit === undefined) mixInherit = true
        if(styleB === undefined || styleB === this)
            return this
        if(!isStyleObject(styleB)) styleB = Style(styleB)

        var cacheKey = [this,styleB,mixInherit]
        var mixedStyle = mixedStyles.get(cacheKey)
        if(mixedStyle === undefined) {     // note: mixedStyle can only be undefined if the two style have never been mixed before
            var mixedStyle = mixWithoutCreatingNativePseudoclasses(this, styleB, mixInherit)
            mixedStyles.set(cacheKey, mixedStyle)
        }

        return mixedStyle
    }

    // returns a copy of the style with a new className
    this.copy = function () {
        return mixWithoutCreatingNativePseudoclasses(this, Style(), true)
    }

    // returns an object with the members
        // fns - the functions for the given pseudoclass
        // parameter - the processed parameter to pass into fns.setup
    // pseudoclass - a pseudoclass selector (eg "not(:required)")
    function getEmulatedInfo(pseudoclass) {
        var parts = getPseudoClassParts(pseudoclass)
        var fns = jsRenderedPseduoclasses[parts.class]

        if(fns ===  undefined) {
            throw new Error("Pseudoclass "+parts.class+" isn't emulated, but has a style that can't be rendered in pure css")
        }

        var info = {fns: fns}
        if(parts.parameter !== undefined) {
            if(fns.processParameter !== undefined) {
                info.parameter = fns.processParameter(parts.parameter)
            } else {
                info.parameter = parts.parameter
            }
        }

        return info
    }

    // returns an object
        // either with the properties:
            // style - style that has native css properties (basic and pseudoclass) set for it and its block's computedStyleMap
                // this return value *can* be this style itself if there are no interactions with the passed styleMap
            // styleMap - a potentially new styleMap that has copied or inserted styles needed for native psuedoclass rendering
            // nativePsuedoclassMap - a new pseudoclassMap to set on the block
        // OR with the proeprties:
            // cancel:true - exists if a pure native psuedoclass style can't be rendered native because of a collision with a computedStyleMap style that isn't pure native
            // style - the new style to get the pseudoclass style from (and then set with setPreStyleMapStyle)
    // styleMap - a map of style selectors (Gem names or labels) to Styles who's classNames will be used to create the native css
        // intended to be a style map that comes from a block's computedStyleMap property
        // the computedStyleMap can affect how sub-pseudoclass selectors are written
    // nativePseudoclassSelectorMap - an object where each key is a base css-selector, and each value is a Style object
    // jsRenderedPseudoclassIndex - if this style is a js-redered/emulated psueodclass, this is its index inside its parent style's pseudoclasses.classes map, otherwise the value will be 0
    this.createNativeCssInfo = function(gem, styleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle) {
        if(this.inherit) {
            var parentCacheKey = gem.parent
        }
        var cacheKey = [parentCacheKey, styleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle]
        var cacheHasStyleMap = this.nativeCssInfoCache.has(cacheKey)
        if(cacheHasStyleMap) {
            return this.nativeCssInfoCache.get(cacheKey)
        }
        // else
        var styleToReturn = this // can change below if there is an interaction with the styleMap
        if(this.pureNative && this.pseudoclasses.classes.keys().length !== 0) { // only care about pseudoclass interactions if it has pseudoclasses
            var styleSelectors = containedStyleSelectors(this)
            var info = stylesInfo(styleSelectors, styleMap)
            var interacts = info.impure.length > 0
            if(!interacts) {
//                var pureStyleInteractionCacheItem = this.pureStyleInteractionCache.get(info.undef)
//                if(pureStyleInteractionCacheItem === undefined) {
                    var evenNewerComputedStyleMap = utils.merge({},styleMap) // copy
                    for(var key in evenNewerComputedStyleMap) {
                        if(key in styleSelectors) {
                            evenNewerComputedStyleMap[key] = evenNewerComputedStyleMap[key].copy() // copy to ensure that a unique className is created (so that native pseudoclasses don't have the possibility of merging weirdly)
                        }
                    }
                    for(var n=0; n<info.undef.length; n++) {
                        evenNewerComputedStyleMap[info.undef[n]] = Style()  // empty style who's className will be used to create native pseudoclass styles
                    }

                    styleToReturn = this.copy()    // a new style className is needed to avoid potential incorrect css overlap
                    styleMap = evenNewerComputedStyleMap
//                    this.pureStyleInteractionCache.set(info.undef, {style:styleToReturn, map: styleMap})
//                } else {
//                    styleToReturn = pureStyleInteractionCacheItem.style
//                    styleMap = pureStyleInteractionCacheItem.map
//                }
            } else {
                var retryStyle = this.copy()
                changeStyleToNonNative(retryStyle)

                var result = {cancel: true, retryStyle: retryStyle}
                setNativeCssInfoCache(this.nativeCssInfoCache, result)
                return result
            }
        }

        if(!styleToReturn.basicNativeCssRendered) {
            setCss('.'+styleToReturn.className, styleToReturn.basicProperties)
            styleToReturn.basicNativeCssRendered = true
        }

        var newNativePseudoclassMap = createNativePseudoclasses(gem, styleToReturn, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle)

        var result = {style: styleToReturn, styleMap: styleMap, nativePseudoclassMap: newNativePseudoclassMap}
        setNativeCssInfoCache(this.nativeCssInfoCache, result)
        return result


        // mutates the passed style so that its not native
        function changeStyleToNonNative(style) {
            style.pureNative = false
            var newClasses = new HashMap
            style.pseudoclasses.classes.forEach(function(pseudoclassStyle, individualPseudoclasses) {
                //if(style.pureNative) { // all of these will be pureNative, or style wouldn't be
                    var copy = pseudoclassStyle.copy()
                    copy.pureNative = false
                    newClasses.set(individualPseudoclasses, copy)

                    individualPseudoclasses.forEach(function(pseudoclass) {
                        if(!(pseudoclass in pseudoclassStyle.pseudoclasses.emulatedInfo)) {
                            style.pseudoclasses.emulatedInfo[pseudoclass] = getEmulatedInfo(pseudoclass)
                        }
                    })

                /*} else {
                    newClasses.set(individualPseudoclasses, style)
                }*/
            })

            style.pseudoclasses.classes = newClasses

            return style
        }

        function setNativeCssInfoCache(nativeCssInfoCache, value) {
            nativeCssInfoCache.set(cacheKey, value)
        }

        // returns the label and block selectors within the style (recursive)
        // the grabs from both componentStyleMap and psuedoclasses.native[x].componentStyleMap
        function containedStyleSelectors(style) {
            var result = {}
            for(var key in style.componentStyleMap) {
                var innerStyle = style.componentStyleMap[key]
                mergeInSelectors(key, innerStyle)
            }

            style.pseudoclasses.classes.forEach(function(pseudoclassStyle) {
                if(pseudoclassStyle.pureNative) {
                    for(var key in pseudoclassStyle.componentStyleMap) {
                        var innerStyle = pseudoclassStyle.componentStyleMap[key]
                        mergeInSelectors(key, innerStyle)
                    }
                }
            })

            return result


            function mergeInSelectors(key, innerStyle) {
                result[key] = true

                var selectors = containedStyleSelectors(innerStyle)
                utils.merge(result, selectors)
            }
        }

        // returns info about what styles in styleSelectors and in newComputedStyleMap are:
            // impure in newComputedStyleMap
            // not defined in newComputedStyleMap
        function stylesInfo(styleSelectors, newComputedStyleMap) {
            var impure = []
            var undef = []
            for(var key in styleSelectors) {
                var style = newComputedStyleMap[key]
                if(style === undefined) {
                    undef.push(key)
                } else if(!style.pureNative) {
                    impure.push(key)
                }
            }
            return {impure:impure,undef:undef}
        }
    }

    this.toObject = function() {
        var object = {}
        for(var property in this.basicProperties) {
            object[property] = this.basicProperties[property]
        }

        if(this.inherit)
            object.$inherit = true

        for(var selector in this.componentStyleMap) {
            object[selector] = this.componentStyleMap[selector].toObject()
        }

        var addPseudoclass = function(pseudoclassList, style) {
            var curObject = object, lastObject, lastPseudoclass
            pseudoclassList.forEach(function(pseudoclass) {
                var curPseudoclass = '$$'+pseudoclass
                if(curObject[curPseudoclass] === undefined) {
                    curObject[curPseudoclass] = {}
                }

                lastPseudoclass = curPseudoclass
                lastObject = curObject
                curObject = curObject[lastPseudoclass]
            })

            var newProperties = style.toObject()
            for(var key in newProperties) {
                lastObject[lastPseudoclass][key] = newProperties[key] // merge
            }

        }

        if(this.pseudoclasses.classes !== undefined) {
            this.pseudoclasses.classes.forEach(function(style, pseudoclassList) {
                addPseudoclass(pseudoclassList, style)
            })
        }

        if(this.stateHandler !== undefined) {
            object.$state = this.stateHandler
        }
        if(this.setup !== undefined) {
            object.$setup = this.setup
        }
        if(this.kill !== undefined) {
            object.$kill = this.kill
        }

        return object
    }

    // converts the style into a JSON string
    // note that $state, $setup, and $kill functions are also stored as strings
    this.toString = function() {
        var obj = this.toObject()

        var transformFunctionsToStrings = function(obj) {
            for(var p in obj) {
                var x = obj[p]
                if(x instanceof Function) {
                    obj[p] = x.toString()
                } else if(x instanceof Object) {
                    transformFunctionsToStrings(x)
                }
            }
        }

        transformFunctionsToStrings(obj)

        return JSON.stringify(obj)
    }

    // instance properties

    this.className          // the css classname for this style
    this.componentStyleMap; // maps a Component name to a Style object for that component
    this.setup;             // run some javascript on any element this class is applied to
    this.kill;              // a function to run on removal of the style (should reverse setup)


    // private properties

    this.nativeCssInfoCache; // instance property that stores a map between a styleMap and a potentially modified pair: {style:<Style object>, styleMap: <computedStyleMap>}
    this.basicNativeCssRendered; // contains true if the css class has been written to a stylesheet


    // creates a new style with styleB mixed into styleA (styleB overrides)
    // does not create native pseudoclass styles
    // mixInherit - if true, mixes in the 'inherit' property, if false, 'inherit' will get undefined (same as inherit===false)
    function mixWithoutCreatingNativePseudoclasses(styleA, styleB, mixInherit) {
        // mix css properties and non-emulated pseudoclass properties
        var mainStylesMerged = utils.merge({}, styleA.basicProperties, styleB.basicProperties)
        var newStyle = Style(mainStylesMerged)

        // mix block and label properties
        newStyle.componentStyleMap = mergeComponentStyleMaps(styleA, styleB)

        // mix pseudoclass properties
        newStyle.pseudoclasses = mergePseudoclasses(styleA, styleB)

        // mix $state
        if(styleB.stateHandler !== undefined) {
            newStyle.stateHandler = styleB.stateHandler
        } else {
            newStyle.stateHandler = styleA.stateHandler
        }

        // mix $setup and $kill                                                                                                                                                                                                                                                                 waaahhh hah hah haaaaaaa
        if(styleB.setup !== undefined) {
            newStyle.setup = styleB.setup
        } else {
            newStyle.setup = styleA.setup
        }
        if(styleB.kill !== undefined) {
            newStyle.kill = styleB.kill
        } else {
            newStyle.kill = styleA.kill
        }

        if(mixInherit) {
            newStyle.inherit = styleA.inherit || styleB.inherit
        }

        newStyle.pureNative = isPureNative(newStyle)

        return newStyle
    }

    // returns a new component style map where styleB overrides styleA
    // handles the 'inherit' option on styles
    function mergeComponentStyleMaps(styleA, styleB) {
        var mergedStyleMap = utils.merge({}, styleA.componentStyleMap)
        for(var key in styleB.componentStyleMap) {
            var styleMapping = styleB.componentStyleMap[key] // a Style object

            mergedStyleMap[key] = conditionalMix(mergedStyleMap[key], styleMapping)
        }

        return mergedStyleMap
    }

    // conditionally mixes two styles
    // returns b mixed into a if b inherits
    // otherwise returns b
    function conditionalMix(a,b) {
        if(b === undefined)
            return a

        if(b.inherit) {
            if(a === undefined)
                return b
            else
                return a.mix(b, false)
        } else {
            return b
        }
    }

    // returns true if the style can be rendered with pure css (no javascript needed)
    function isPureNative(style) {
        if(style.setup === undefined && style.kill === undefined && style.stateHandler === undefined
        ) {
            var allPseudoclassesNative = true
            style.pseudoclasses.classes.forEach(function(style) {
                if(!style.pureNative) allPseudoclassesNative = false
            })
            if(!allPseudoclassesNative) {
                return false
            }

            var allPureNative = true
            for(var key in style.componentStyleMap) {
                if(style.componentStyleMap[key].pureNative !== true) {
                    allPureNative = false
                    break
                }
            }
            if(!allPureNative) {
                return false
            }

            return true
        }
    }

    // mixes together the pseudoclass properties of two styles
    // handles changing native pseudoclass handling to emulated (and vice versa)
    function mergePseudoclasses(styleA, styleB) {
        var merged = mergeStyleMaps(styleA.pseudoclasses.classes, styleB.pseudoclasses.classes)
        var emulatedInfo = utils.merge({}, styleA.pseudoclasses.emulatedInfo, styleB.pseudoclasses.emulatedInfo)

        return {classes: merged, emulatedInfo:emulatedInfo}


        // returns a new map with mapA and mapB merged, where mapB's styles override
        function mergeStyleMaps(styleMapA, styleMapB) {
            var result = utils.hashmapMerge(new HashMap, styleMapA)
            styleMapB.forEach(function(v, key) {
                if(result.has(key)) {
                    var resultValue = result.get(key).mix(styleMapB.get(key), true)
                } else {
                    var resultValue = styleMapB.get(key)
                }

                result.set(key, resultValue)
            })

            return result
        }
    }

    var singleColonForPseudoElements = false; // may be changed if its detected that the browser does this
    var doubleColonPseudoElRegex =      /(::)(before|after|first-line|first-letter|selection)/;
    var singleColonPseudoElRegex = /([^:])(:)(before|after|first-line|first-letter|selection)/;

    // creates a css selector with the passed properties
    function setCss(selector, properties) {
        var unCamelCasedProperties = {}
        for (key in properties) {
            unCamelCasedProperties[mapCamelCase(key)] = properties[key]
        }

        var rule = addRule(jss.defaultSheet, selector)
        setStyleProperties(rule, properties);



        function addRule(sheet, selector) {
	        var rules = sheet.cssRules || sheet.rules || [];
	        var index = rules.length;

            var pseudoElementRule = addPseudoElementRule(sheet, selector, rules, index);
            if (!pseudoElementRule) {
                addRuleToSheet(sheet, selector, index);
            }

	        return rules[index].style
	    }

        // Handles single colon syntax for older browsers and bugzilla.mozilla.org/show_bug.cgi?id=949651
        function addPseudoElementRule(sheet, selector, rules, index) {
            var doubleColonSelector;
            var singleColonSelector;

            if (doubleColonPseudoElRegex.exec(selector)) {
                doubleColonSelector = selector;
                singleColonSelector = toSingleColonPseudoElements(selector);
            } else if (singleColonPseudoElRegex.exec(selector)) {
                doubleColonSelector = toDoubleColonPseudoElements(selector);
                singleColonSelector = selector;
            } else {
                return false; // Not dealing with a pseudo element
            }

            if (!singleColonForPseudoElements) {
                // Assume modern browser and then check if successful
                try {
                    addRuleToSheet(sheet, doubleColonSelector, index);
                } catch(e) {
                    // if there's an error, assume its because the selector was deemed invalid (firefox), so try -moz- extension
                    addRuleToSheet(sheet, toMozDoubleColonPseudoElements(selector), index);
                }
                if (rules.length <= index) {
                    singleColonForPseudoElements = true;
                }
            }
            if (singleColonForPseudoElements) {
                addRuleToSheet(sheet, singleColonSelector, index);
            }

            return true;
        }

        function addRuleToSheet(sheet, selector, index) {
	        if (sheet.insertRule) {
	            sheet.insertRule(selector + ' { }', index);
	        } else {
	            sheet.addRule(selector, null, index);
	        }
	    }

        function setStyleProperties(ruleStyle, properties) {
	        for (var key in properties) {
                ruleStyle.setProperty(key, properties[key])
	        }
	    }

        function toDoubleColonPseudoElements(selector) {
            return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
                return submatch1 + '::' + submatch3;
            });
        }
        function toMozDoubleColonPseudoElements(selector) {
            return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
                return submatch1 + '::-moz-' + submatch3;
            });
        }
        function toSingleColonPseudoElements(selector) {
            return selector.replace(doubleColonPseudoElRegex, function(match, submatch1, submatch2) {
                return ':' + submatch2;
            })
        }
    }


    // creates the css styles necessary to render the native pseudoclass styles of this style (and contained styles that can be rendered native)
    // intended to be called only once per style
    // styleMap - A block's new computedStyleMap. Selectors that also exist in native pseudoclasses of the style have already been created or copied (so you can be sure creating css class styles for them won't conflict with anything)
    // jsRenderedPseudoclassIndex - the index of the active pseudoclass style - needed for deciding what native css needs to be overridden by `style`
        // if this is 0, no overriding needs to happen (so 0 is also set when there's no active js-rendered/emulated pseudoclass)
    function createNativePseudoclasses(gem, style, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle) {
        if(nativePseudoclassSelectorMap === undefined) nativePseudoclassSelectorMap = {}

        var nativePseudoclassSelectors = []
        //var nativePseudoclassPropertiesToOverride = {}   // stores what style properties for what pseudoclasses needs to be overridden by an emulated style
        var newNativePseudoclassMap = {} // a mapping from a Gem name to a nativePseudoclassSelectorMap
        var index = 0
        style.pseudoclasses.classes.forEach(function(pseudoclassStyle, pseudoclassKey) {
            var fullSelector = '.'+style.className+':'+pseudoclassKey.join(':')
            if(pseudoclassStyle.pureNative) {
                // create css styles for top-level css properties of the native psuedoclass
                createPseudoClassRules(fullSelector, pseudoclassStyle.basicProperties, style, false)
                nativePseudoclassSelectors.push(pseudoclassKey.join(':'))

                for(var blockSelector in pseudoclassStyle.componentStyleMap) {
                    addNativePseudoclassMapItem(blockSelector, fullSelector, pseudoclassStyle.componentStyleMap[blockSelector])
                }
            } else if(index === jsRenderedPseudoclassIndex) {
                // create overriding css styles for top-level css properties of the emulated psuedoclass (so that emulated and native pseudoclasses mix properly)
                for(var n=0; n<nativePseudoclassSelectors.length; n++) {
                    var selector = nativePseudoclassSelectors[n]
                    createPseudoClassRules(fullSelector+":"+selector, style.basicProperties, style, true)
                }
            }

            index++
        })

        var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 2)
        for(var selector in nativePseudoclassSelectorMap) {
            var pseudoclassStyle = nativePseudoclassSelectorMap[selector]
            if(pseudoclassStyle.inherit) {
                pseudoclassStyle = blockStyleUtils.getInheritingStyle(gem).mix(pseudoclassStyle, false)
            }

            var fullSelector = selector+' '+'.'+style.className

            // create css styles for the top-level style when inside a pure native pseudoclass style of its parent
            createPseudoClassRules(fullSelector, pseudoclassStyle.basicProperties, style, true)

            for(var blockSelector in pseudoclassStyle.componentStyleMap) {
                addNativePseudoclassMapItem(blockSelector, fullSelector, pseudoclassStyle.componentStyleMap[blockSelector])
            }

            // create css styles for pseudoclass styles when inside a pure native pseudoclass style of its parent
            pseudoclassStyle.pseudoclasses.classes.forEach(function(pseudoclassStyle, pseudoclassKey) {
                if(pseudoclassStyle.pureNative) {
                    createPseudoClassRules(fullSelector+':'+pseudoclassKey.join(':'), pseudoclassStyle.basicProperties, style, true)
                }
            })
        }

        return newNativePseudoclassMap


        function addNativePseudoclassMapItem(blockSelector, cssSelector, styleValue) {
            if(newNativePseudoclassMap[blockSelector] === undefined)
                newNativePseudoclassMap[blockSelector] = {}
            newNativePseudoclassMap[blockSelector][cssSelector] = styleValue
        }

        // cssProperties - The css rules to apply (should only contain native css properties). CamelCase and certain integer values will be converted.
        // overwriteBloodyStyles - if true, styles from styleMapStyle are overridden with the default (either a block's default or the base default)
        function createPseudoClassRules(selector, cssProperties,  /*temporary*/ styleMapStyle, overwriteBloodyStyles) {
            if(!style.nativePseudoclassesWritten[selector]) {
                var pseudoClassCss = {}

                if(overwriteBloodyStyles) {
                    // overwrite styles that would bleed over from the styleMapStyle

                    var propertiesToOverride = Object.keys(styleMapStyle.basicProperties)
                    styleMapStyle.pseudoclasses.classes.forEach(function(style) {
                        propertiesToOverride = propertiesToOverride.concat(Object.keys(style.basicProperties))
                    })

                    for(var n=0; n<propertiesToOverride.length; n++) {
                        var key = propertiesToOverride[n]
                        if(defaultStyle) {
                            var defaultStyleProperty = defaultStyle.basicProperties[key]
                        }

                        var initialStyle = defaultStyleProperty || defaultStyleValues[key]
                                           || (key in stylesThatInheritByDefault ? 'inherit' : 'initial') // todo: write a function to calculate the inital value, since 'initial' isn't supported in IE (of course) - tho it will be eventually since its becoming apart of css3
                        pseudoClassCss[key] = initialStyle
                    }
                }

                for(var key in cssProperties) {
                    var value = cssProperties[key]

                    var cssStyle = key
                    var cssStyleName = mapCamelCase(cssStyle)
                    pseudoClassCss[cssStyleName] = cssValue(cssStyleName, value)
                }

                // create immediate pseudo class style
                setCss(selector, pseudoClassCss) // create the css class with the pseudoClass
                if(this.nativePseudoclassStyles !== undefined) {
                    styleMapStyle.nativePseudoclassStyles[selector] = pseudoClassCss
                }

                style.nativePseudoclassesWritten[selector] = true
            }
        }
    }
})


// private


// a map of pseudoclass names and how they are emulated with javascript
// each pseudoclass sets up the following functions:
    // check - a function that checks if that pseudoclass currently applies to the component when its called
    // setup - calls a callback when the pseudoClass starts and stops applying
        // should return an object that will be passed to the kill function (as its 'state' parameter)
    // kill - cleans up anything set up in the 'setup' function
    // processParameter - takes the pseudoclass parameter and returns some object representing it that will be used by the setup and check functions
var jsRenderedPseduoclasses = {
    hover: {
        emulated: true,
        check: function(component) {
            var nodes = document.querySelectorAll( ":hover" )
            for(var n=0; n<nodes.length; n++) {
                if(nodes[n] === component.domNode) {
                    return true
                }
            }
            return false
        },
        setup: function(component, startCallback, endCallback) {
            component.on("mouseover", function() {
                startCallback()
            })
            component.on("mouseout", endCallback)

            return {start: startCallback, end: endCallback}
        },
        kill: function(component, state) {
            component.off("mouseover", state.start)
            component.off("mouseout", state.end)
        }
    },
    checked: {
        emulated: true,
        check: function(component) {
            if(component.domNode.nodeName !== 'INPUT' && component.domNode.nodeName !== 'OPTION') {
                console.warn("The pseudoclass 'checked' can only apply to 'input' nodes (Button, CheckBox, RadioButton, or TextField) or 'option' nodes (Option)")
                return false
            }
            return component.selected
        },
        setup: function(component, startCallback, endCallback) {
            var setupState = {}
            component.on("change", setupState.listener = function() {
                if(component.selected) {
                    startCallback()
                } else {
                    endCallback()
                }
            })

            return setupState
        },
        kill: function(component, state) {
            component.removeListener("change", state.listener)
        }
    },
    required: {
        emulated: true,
        check: function(component) {
            if(component.domNode.nodeName !== 'INPUT') {
                console.warn("The pseudoclass 'required' can only apply to 'input' nodes (Button, CheckBox, RadioButton, or TextField)")
                return false
            }
            return component.attr('required') !== undefined
        },
        setup: function(component, startCallback, endCallback) {
            var observer = new MutationObserver(function() {
                if(component.attr('required') !== undefined) {
                    startCallback()
                } else {
                    endCallback()
                }
            })

            observer.observe(component.domNode, {attributes: true})

            return {observer: observer}
        },
        kill: function(component, state) {
            state.observer.disconnect()
        }
    },
    'last-child': {
        emulated: true,
        check: function(component) {
            return nthLastChildCheck(component, '1')
        },
        setup: function(component, startCallback, endCallback) {
            var observer = new MutationObserver(function() {
                if(nthLastChildCheck(component, '1')) {
                    startCallback()
                } else {
                    endCallback()
                }
            })

            var setupObserver = function() {
                // note that since this uses the component parent rather than domNode.parentNode, this won't work for components added to non-component nodes (and there's no good way to do it, because you would have to poll for parent changes)
                observer.observe(component.parent.domNode, {childList: true})
            }

            if(component.parent !== undefined) {
                setupObserver()
            }

            component.on('newParent', function() {
                setupObserver()
            })
            component.on('parentRemoved', function() {
                observer.disconnect()
            })

            return {observer: observer}
        },
        kill: function(component, state) {
            state.observer.disconnect()
        }
    },
    'nth-child': {
        emulated: true,
        parameterTransform: function(parameter) {
            var parts = parseNthChildParameter(parameter)
            if(parts.variable === 0) {
                return parts.constant+''
            } else if(parts.constant === 0) {
                return parts.variable+'n'
            } else {
                return parts.variable+'n+'+parts.constant
            }
        },

        check: function(component, parameterCheck) {
            return nthChildCheck(component, parameterCheck)
        },
        setup: function(component, startCallback, endCallback, parameterCheck) {

            var checkAndCallCallbacks = function() {
                if(nthChildCheck(component, parameterCheck)) {
                    startCallback()
                } else {
                    endCallback()
                }
            }

            var observer = new MutationObserver(function() {
                checkAndCallCallbacks()
            })

            var setupObserver = function() {
                // note that since this uses the component parent rather than domNode.parentNode, this won't work for components added to non-component nodes (and there's no good way to do it, because you would have to poll for parent changes)
                observer.observe(component.parent.domNode, {childList: true})
            }

            if(component.parent !== undefined) {
                setupObserver()
            }

            component.on('newParent', function() {
                setupObserver()
                checkAndCallCallbacks()
            })
            component.on('parentRemoved', function() {
                observer.disconnect()
                checkAndCallCallbacks()
            })

            return {observer: observer}
        },
        kill: function(component, state) {
            state.observer.disconnect()
        },

        // returns a function that takes an index and tell you if that index applies to the nthChildParameter
        processParameter: function(parameter) {
            var parts = parseNthChildParameter(parameter)
            if(parts.variable === 0) {
                return function(index) {
                    return index+1 === parts.constant
                }
            } else {
                return function(index) {
                    return ((index+1-parts.constant)/parts.variable) % 1 === 0
                }
            }
        }
    },

    // not's parameter is a statement consisting of pseudoclasses separated either by : or ,
    // $$not(pseudoclass1&pseudoclass2,psuedoclass3) translates to the css :not(:pseudoclass1:pseudoclass2,:psuedoclass3)
    not: {
        emulated: true,
        parameterTransform: function(parameter) {
            var orParts = parameter.split(',')
            return orParts.map(function(part) {
                var andParts = part.split(':')
                return andParts.map(function(part) {
                    var parts = getPseudoClassParts(part)
                    var mappedName = mapCamelCase(parts.class)
                    if(parts.parameter !== undefined) {
                        return mappedName+'('+parts.parameter+')'
                    } else {
                        return mappedName
                    }
                }).join(':')
            }).join(',')
        },

        check: function(component, parameterCheck) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },
        setup: function(component, startCallback, endCallback, parameterCheck) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },
        kill: function(component, state) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },

        // returns a function that takes an index and tell you if that index applies to the nthChildParameter
        processParameter: function(parameter) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        }
    }
}

// name is the name of the new pseudoclass
// options is an object with the members:
    // check(component) - returns true if the pseudoclass applies to the component
    // setup(component, startCallback, endCallback, parameter) - a function that should call startCallback when the pseudoclass starts applying, and endCallback when it stops applying
        // parameter - the parameter passed to the pseudoclass (e.g. in :not(:first-child), ":first-child" is the parameter)
    // kill - a function that cleans up any event listeners or anything else set up in the 'setup' function
    // processParameter - a function that processes the pseudoclass parameter and returns some object the 'setup' function will get as its 4th argument
        // if this is undefined, the pseudoclass will throw an exception for styles that have a parameter for it
    // emulated - if true, it means that there is a corresponding native pseudoclass that can be used if the style can be rendered with pure css
module.exports.addPseudoClass = function(name, options) {
    var mappedName = mapCamelCase(name)
    if(jsRenderedPseduoclasses[mappedName] !== undefined) {
        var nameForError = '"'+mappedName+'"'
        if(mappedName !== name) {
            nameForError+= " (mapped from '"+name+"')"
        }
        throw new Error("The pseudoclass "+nameForError+" is already defined.")
    }
    // else
    jsRenderedPseduoclasses[mappedName] = options
}


function nthChildCheck(component, testFn) {
    if(component.domNode.parentNode === null)
        return false

    var children = component.domNode.parentNode.children                    // must be domNode.parentNode, because child nodes may not be Components
    var index = Array.prototype.indexOf.call(children, component.domNode)
    return testFn(index)
}

function nthLastChildCheck(component, parameter) {
    if(component.domNode.parentNode === null)
        return false

    var children = component.domNode.parentNode.children                    // must be domNode.parentNode, because child nodes may not be Components
    var index = children.length - parseInt(parameter)
    return children[index] === component.domNode
}

var nthChildParameter = new RegExp(
    '^' // begin
        +'('
            +'('
                +'(-?\\d*)'        // constant
                +'(([+-]\\d*)n?)?' // first-order term
            +')|'
            +'('
                +'(-?\\d)*n?' // first-order term first
                +'([+-]\\d*)?' // then constant
            +')'
        +')'
    +'$' // the EYND
)

// returns the variable and constnat parts of the parameter
function parseNthChildParameter(parameter) {
    var parts = parameter.replace(/\s/g, '').match(nthChildParameter)
    if(parts === null)
        throw new Error("nth-child parameter '"+parameter+"' isn't valid")

    if(parts[2] !== undefined) {
        var constant = parts[3]
        var variable = parts[5]
    } else {
        var constant = parts[8]
        var variable = parts[7]
    }



    if(constant === undefined) constant = 0
    else                       constant = parseInt(constant)
    if(variable === undefined) variable = 0
    else                       variable = parseInt(variable)

    return {variable: variable, constant: constant}
}


// maps a style value to a css value
// style values that are numbers are mapped to strings, usually with px postfix
function cssValue(cssStyleName, value) {
    // If a number was passed in, add 'px' to the (except for certain CSS properties) [also taken from jquery's code]
    if(typeof(value) === "number" && cssNumber[cssStyleName] === undefined) {
        return value+"px"
    } else {
        return value.toString()
    }
}

var pseudoClassRegex = new RegExp( // /^([^(]*)(\((.*)\))?$/
    "([^(]*)"        // anything that's not an open paren
    +"(\\((.*)\\))?" // optionally some arbitrary string inside parens
    +"$"             // THE EYND!
)

// pulls apart the pseudoclass name from its (optional) parameter
// e.g. pulls out 'nth-child' and '2+3n' from 'nth-child(2+3n)'
function getPseudoClassParts(fullPsuedoClass) {
    var x = fullPsuedoClass.match(pseudoClassRegex)
    if(x === null) throw new Error("Pseudoclass '"+fullPsuedoClass+"' is invalid")
    return {class: x[1], parameter: x[3]}
}


// taken from jquery's code
var cssNumber = {
    "column-count": 1,
    "fill-opacity": 1,
    "flex-grow": 1,
    "flex-shrink": 1,
    "font-weight": 1,
    "line-height": 1,
    "opacity": 1,
    "order": 1,
    "orphans": 1,
    "widows": 1,
    "z-index": 1,
    "zoom": 1
}

function isStyleObject(o) {
    return o !== undefined && o.componentStyleMap !== undefined
}


//var asciiA = 'A'.charCodeAt(0), asciiZ = 'Z'.charCodeAt(0), difference = 'a'.charCodeAt(0) - asciiA
function mapCamelCase(cssStyleName) {
    return cssStyleName.replace(/([A-Z])/g, function(match, submatch) {          // this is from jss
        return '-' + submatch.toLowerCase();
    })

    /*for(var n=0; n<cssStyleName.length; n++) {
        var ascii = cssStyleName.charCodeAt(n)
        if(asciiA <= ascii && ascii <= asciiZ) { // found capital letter
            cssStyleName = cssStyleName.slice(0, n) + '-'+String.fromCharCode(ascii+difference) + cssStyleName.slice(n+1)
            n++ // increment a second time for the dash
        }
    }

    return cssStyleName*/
}

// maps all the styles that are inherited by descendant nodes to their default values
// source: http://stackoverflow.com/questions/5612302/which-css-styles-are-inherited
var defaultStyleValues = {
    'azimuth': 'center',
    'border-collapse': 'separate',
    'border-spacing': '0',
    'box-sizing': 'border-box',
    'caption-side': 'top',
    //'color': 'black',         // let this inherit
    //'cursor': 'auto',         // let this one inherit - its weird otherwise
    'direction': 'ltr',
     display: 'inline-block', // changes the default display to inline-block
    'elevation': '',
    'empty-cells': 'show',
    // 'font-family': '',       // let this inherit
    // 'font-size': 'medium',   // let this inherit
    //'font-style': 'normal',   // let this inherit
    //'font-variant': 'normal', // let this inherit
    //'font-weight': 'normal',  // let this inherit
    'letter-spacing': 'normal',
    'line-height': 'normal',
    'list-style-image': 'none',
    'list-style-position': 'outside',
    'list-style-type': 'disc',
    'orphans': '2',
    'pitch-range': '',
    'pitch': '',
     position: 'relative', // changes the default positioning so that absolute is relative to its parent by default
    'quotes': '',
    'richness': '',
    'speak-header': '',
    'speak-numeral': '',
    'speak-punctuation': '',
    'speak': '',
    'speak-rate': '',
    'stress': '',
    'text-align': 'left',
    'text-indent': '0',
    'text-transform': 'none',
    //'visibility': 'visible',    // let this inherit - otherwise you just hide the container and not the contents
    'voice-family': '',
    'volume': '',
    'white-space': 'normal',
    'widows': '2',
    'word-spacing': 'normal'
}

var stylesThatInheritByDefault = {
    'font-family':1, 'font-size':1, 'font-style':1, 'font-variant':1, 'font-weight':1, 'visibility':1, 'color':1, 'cursor':1
}




// returns index of the passed css classname, or undefined if sheet containing that class isn't found
function cssClassSheetIndex(classname) {
    var result = undefined

    var styleNodes = document.querySelectorAll("style")
    for(var n=0; n<styleNodes.length; n++) {
        var sheet = styleNodes[n].sheet
        jssModule.defaultSheet = sheet

        var defaultStyleMaybe = jssModule.get(classname)
        if(Object.keys(defaultStyleMaybe).length > 0) {
            result = n
            break
        }
    }

    jssModule.defaultSheet = undefined
    return result
}


var defaultJss = jssModule.forDocument(document) // must be created before the jss object (so that the styles there override the styles in the default sheet)
var jss = jssModule.forDocument(document)

var defaultClassSheetIndex = cssClassSheetIndex('.'+Style.defaultClassName)
if(defaultClassSheetIndex === undefined) {
    defaultJss.defaultSheet = defaultJss._createSheet() // create its sheet first (before the regular jss sheet)

    jss.defaultSheet = jss._createSheet()
} else {
    // if the default styleclass *already* exists, it probably means that blocks.js is being loaded twice
    console.log("Warning: the default-styles class name for blocks.js looks like its already in use. This probably means you have two versions of blocks.js loaded. If so, Gem.js will continue to work, but your app will be a bit bloated. If something other than block.js created that class, blocks.js may break that style.")

    var styleNodes = document.querySelectorAll("style")
    defaultJss.defaultSheet = styleNodes[defaultClassSheetIndex].sheet
    jss.defaultSheet = styleNodes[defaultClassSheetIndex+1].sheet

    // make sure the baseClassName isn't already taken
    var dedupNumber = 0
    while(true) {
        var testBaseClassName = baseClassName+dedupNumber
        if(cssClassSheetIndex('.'+testBaseClassName+dedupNumber+0) !== undefined) {
            dedupNumber++
        } else {
            break;
        }
    }

    baseClassName = testBaseClassName+dedupNumber
}

defaultJss.set('.'+Style.defaultClassName, defaultStyleValues) // creates default css class in order to prevent inheritance

defaultJss.set('input', { // chrome and firefox user agent stylesheets mess with this otherwise
    cursor: 'inherit'
})
defaultJss.set('img', { // images should retain content-box sizing, since pixel perfect width on images is important so you avoid resizing the image
    'box-sizing': 'content-box'
})


/*private*/ module.exports.isDev; // should be set by Gem


/***/ }),
/* 10 */
/*!**********************************************!*\
  !*** ./node_modules/gem/src/external/jss.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/*
 * JSS v0.6 - JavaScript Stylesheets
 * https://github.com/Box9/jss
 *
 * Copyright (c) 2011, David Tang
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */
var jss = (function() {
    var adjSelAttrRegex = /((?:\.|#)[^\.\s#]+)((?:\.|#)[^\.\s#]+)/g;
    var doubleColonPseudoElRegex = /(::)(before|after|first-line|first-letter|selection)/;
    var singleColonPseudoElRegex = /([^:])(:)(before|after|first-line|first-letter|selection)/;
    var singleColonForPseudoElements; // flag for older browsers

    function getSelectorsAndRules(sheet) {
        var rules = sheet.cssRules || sheet.rules || [];
        var results = {};
        for (var i = 0; i < rules.length; i++) {
            // Older browsers and FF report pseudo element selectors in an outdated format
            var selectorText = toDoubleColonPseudoElements(rules[i].selectorText);
            if (!results[selectorText]) {
                results[selectorText] = [];
            }
            results[selectorText].push({
                sheet: sheet,
                index: i,
                style: rules[i].style
            });
        }
        return results;
    }

    function getRules(sheet, selector) {
        var rules = sheet.cssRules || sheet.rules || [];
        var results = [];
        // Browsers report selectors in lowercase
        selector = selector.toLowerCase();
        for (var i = 0; i < rules.length; i++) {
            var selectorText = rules[i].selectorText;
            // Note - certain rules (e.g. @rules) don't have selectorText
            if (selectorText && (selectorText == selector || selectorText == swapAdjSelAttr(selector) || selectorText == swapPseudoElSyntax(selector))) {
                results.push({
                    sheet: sheet,
                    index: i,
                    style: rules[i].style
                });
            }
        }
        return results;
    }

    function addRule(sheet, selector) {
        var rules = sheet.cssRules || sheet.rules || [];
        var index = rules.length;
        var pseudoElementRule = addPseudoElementRule(sheet, selector, rules, index);

        if (!pseudoElementRule) {
            addRuleToSheet(sheet, selector, index);
        }

        return {
            sheet: sheet,
            index: index,
            style: rules[index].style
        };
    };

    function addRuleToSheet(sheet, selector, index) {
        if (sheet.insertRule) {
            sheet.insertRule(selector + ' { }', index);
        } else {
            sheet.addRule(selector, null, index);
        }
    }

    // Handles single colon syntax for older browsers and bugzilla.mozilla.org/show_bug.cgi?id=949651
    function addPseudoElementRule(sheet, selector, rules, index) {
        var doubleColonSelector;
        var singleColonSelector;

        if (doubleColonPseudoElRegex.exec(selector)) {
            doubleColonSelector = selector;
            singleColonSelector = toSingleColonPseudoElements(selector);
        } else if (singleColonPseudoElRegex.exec(selector)) {
            doubleColonSelector = toDoubleColonPseudoElements(selector);
            singleColonSelector = selector;
        } else {
            return false; // Not dealing with a pseudo element
        }

        if (!singleColonForPseudoElements) {
            // Assume modern browser and then check if successful
            addRuleToSheet(sheet, doubleColonSelector, index);
            if (rules.length <= index) {
                singleColonForPseudoElements = true;
            }
        }
        if (singleColonForPseudoElements) {
            addRuleToSheet(sheet, singleColonSelector, index);
        }

        return true;
    }

    function toDoubleColonPseudoElements(selector) {
        return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
            return submatch1 + '::' + submatch3;
        });
    }

    function toSingleColonPseudoElements(selector) {
        return selector.replace(doubleColonPseudoElRegex, function(match, submatch1, submatch2) {
            return ':' + submatch2;
        })
    }

    function removeRule(rule) {
        var sheet = rule.sheet;
        if (sheet.deleteRule) {
            sheet.deleteRule(rule.index);
        } else if (sheet.removeRule) {
            sheet.removeRule(rule.index);
        }
    }

    function extend(dest, src) {
        for (var key in src) {
            if (!src.hasOwnProperty(key))
                continue;
            dest[key] = src[key];
        }
        return dest;
    }

    function aggregateStyles(rules) {
        var aggregate = {};
        for (var i = 0; i < rules.length; i++) {
            extend(aggregate, declaredProperties(rules[i].style));
        }
        return aggregate;
    }

    function declaredProperties(style) {
        var declared = {};
        for (var i = 0; i < style.length; i++) {
            declared[style[i]] = style[toCamelCase(style[i])];
        }
        return declared;
    }

    // IE9 stores rules with attributes (classes or ID's) adjacent in the opposite order as defined
    // causing them to not be found, so this method swaps [#|.]sel1[#|.]sel2 to become [#|.]sel2[#|.]sel1
    function swapAdjSelAttr(selector) {
        var swap = '';
        var lastIndex = 0;

        while ((match = adjSelAttrRegex.exec(selector)) != null) {
            if (match[0] === '')
                break;
            swap += selector.substring(lastIndex, match.index);
            swap += selector.substr(match.index + match[1].length, match[2].length);
            swap += selector.substr(match.index, match[1].length);
            lastIndex = match.index + match[0].length;
        }
        swap += selector.substr(lastIndex);

        return swap;
    };

    // FF and older browsers store rules with pseudo elements using single-colon syntax
    function swapPseudoElSyntax(selector) {
        if (doubleColonPseudoElRegex.exec(selector)) {
            return toSingleColonPseudoElements(selector);
        }
        return selector;
    }

    function setStyleProperties(rule, properties) {
        for (var key in properties) {
            var value = properties[key];
            var importantIndex = value.indexOf(' !important');

            // Modern browsers seem to handle overrides fine, but IE9 doesn't
            rule.style.removeProperty(key);
            if (importantIndex > 0) {
                rule.style.setProperty(key, value.substr(0, importantIndex), 'important');
            } else {
                rule.style.setProperty(key, value);
            }
        }
    }

    function toCamelCase(str) {
        return str.replace(/-([a-z])/g, function (match, submatch) {
            return submatch.toUpperCase();
        });
    }

    function transformCamelCasedPropertyNames(oldProps) {
        var newProps = {};
        for (var key in oldProps) {
            newProps[unCamelCase(key)] = oldProps[key];
        }
        return newProps;
    }

    function unCamelCase(str) {
        return str.replace(/([A-Z])/g, function(match, submatch) {
            return '-' + submatch.toLowerCase();
        });
    }

    var Jss = function(doc) {
        this.doc = doc;
        this.head = this.doc.head || this.doc.getElementsByTagName('head')[0];
        this.sheets = this.doc.styleSheets || [];
    };

    Jss.prototype = {
        // Returns JSS rules (selector is optional)
        get: function(selector) {
            if (!this.defaultSheet) {
                return {};
            }
            if (selector) {
                return aggregateStyles(getRules(this.defaultSheet, selector));
            }
            var rules = getSelectorsAndRules(this.defaultSheet);
            for (selector in rules) {
                rules[selector] = aggregateStyles(rules[selector]);
            }
            return rules;
        },
        // Returns all rules (selector is required)
        getAll: function(selector) {
            var properties = {};
            for (var i = 0; i < this.sheets.length; i++) {
                extend(properties, aggregateStyles(getRules(this.sheets[i], selector)));
            }
            return properties;
        },
        // Adds JSS rules for the selector based on the given properties
        set: function(selector, properties) {
            if (!this.defaultSheet) {
                this.defaultSheet = this._createSheet();
            }
            properties = transformCamelCasedPropertyNames(properties);
            var rules = getRules(this.defaultSheet, selector);
            if (!rules.length) {
                rules = [addRule(this.defaultSheet, selector)];
            }
            for (var i = 0; i < rules.length; i++) {
                setStyleProperties(rules[i], properties);
            }
        },
        // Removes JSS rules (selector is optional)
        remove: function(selector) {
            if (!this.defaultSheet)
                return;
            if (!selector) {
                this._removeSheet(this.defaultSheet);
                delete this.defaultSheet;
                return;
            }
            var rules = getRules(this.defaultSheet, selector);
            for (var i = 0; i < rules.length; i++) {
                removeRule(rules[i]);
            }
            return rules.length;
        },
        _createSheet: function() {
            var styleNode = this.doc.createElement('style');
            styleNode.type = 'text/css';
            styleNode.rel = 'stylesheet';
            this.head.appendChild(styleNode);
            return styleNode.sheet;
        },
        _removeSheet: function(sheet) {
            var node = sheet.ownerNode;
            node.parentNode.removeChild(node);
        }
    };

    var exports = new Jss(document);
    exports.forDocument = function(doc) {
        return new Jss(doc);
    };
    return exports;
})();

typeof module !== 'undefined' && module.exports && (module.exports = jss); // CommonJS support

/***/ }),
/* 11 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 12)))

/***/ }),
/* 12 */
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);
});
//# sourceMappingURL=Dropdown.umd.js.map