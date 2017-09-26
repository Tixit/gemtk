// note: this is  not intended to be used directly - only through Combobox, or other

var proto = require('proto')

var Gem = require('gem')
var Style = require('gem/Style')

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