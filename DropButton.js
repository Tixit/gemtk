var proto = require('proto')

var utils = require("./utils")
var Dropdown = require('./Dropdown')

// A Dropdown that opens when you click on it, and closes when you click off it
module.exports = proto(Dropdown, function(superclass) {
    this.name = 'DropButton'

    this.build = function(/*[label,]button, dropdown[, maintainDropdownPosition]*/) {
        var that = this
        superclass.build.apply(this, arguments)

        this.virtualAncestors = [] // if any gem in here is clicked, close won't be triggered
        this.on('mousedown', function(e) {
            if(e.button === 0) { // normal click
                that.open()
            }
        })
    }

    this.open = function() {
        if(!this.isOpen) {
            superclass.open.apply(this,arguments)

            var that = this
            setTimeout(function() { // have to do this in a timeout otherwise the handler will be triggered off the click that sets it up
                document.addEventListener('mousedown', that.closeHandler = function(event) {
                    var anyOver = that.virtualAncestors.concat(that.dropdown).some(function(gem) {
                        return utils.isPointOver(event.pageX, event.pageY, gem.domNode)
                    })

                    if(!anyOver) {
                        that.close()
                    }
                })
            },0)
        }
    }
    this.close = function() {
        if(this.isOpen) {
            document.removeEventListener('mousedown', this.closeHandler)
            superclass.close.apply(this,arguments)
            this.closeHandler = undefined
        }
    }
})
