var proto = require('proto')

var Gem = require('gem')
var Style = require('gem/Style')
var Block = require('gem/Block')

var utils = require("./utils")

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
