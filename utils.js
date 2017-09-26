
var Style = require("gem/Style")
var gemStyleUtils = require('./node_modules/gem/src/node_modules/blockStyleUtils')

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