var proto = require('proto')
var ks = require("keysight")

var Gem = require('gem');
var Style = require("gem/Style")
var Text = require("gem/Text")

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
