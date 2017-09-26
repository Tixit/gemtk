var proto = require("proto")
var Gem = require("gem")
var HashMap = require("hashmap")
var Style = require("gem/Style")
var Block = require("gem/Block")
var Svg = require("gem/Svg")

var DropButton = require('./DropButton')
var Option = require('./Option')
var TextEditor = require("./TextEditor")

var dropdownArrow = '<svg viewBox="0 0 531.74 460.5" overflow="visible" enable-background="new 0 0 531.74 460.5" xml:space="preserve">'+
                    '<polygon stroke="#000000" points="530.874,0.5 265.87,459.5 0.866,0.5 "/>'+
                    '</svg>'

// A Dropdown that has a text input as well as a number of select options that can populate the text box
// Has a similar api to the Select gem
// emits a 'change' event when its 'val' changes
module.exports = proto(DropButton, function (superclass) {

  // static variables

  this.name = 'Combobox'
  this.defaultStyle = Style({
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid gray',
    $openArrow: {
      width: 10,
      fill: 'currentColor',
      marginRight: 1
    },
    $button: {
      paddingLeft: 2
    }
  })

  this.Option = Option

  // optionValues - An array of values the dropdown is populated with.
  // renderOption(option) - Takes in an option value and returns a block displaying that value.
  // optionalAttributes - An object that can contain the keys:
    // allowAnyValue (default: true) - If true, any value can be input. If false, it will error if a value not listed in the options is set.
  this.build = function ( /*[label,] optionValues, optionalAttributes, renderOption*/ ) {
    var that = this

    var args = arguments,
      curArgIndex = 0
    var getNextArg = function (test) {
      if (test(args[curArgIndex])) {
        var index = curArgIndex
        curArgIndex++
        return args[index]
      }
    }

    var label = getNextArg(function (arg) {
      return typeof (arg) === 'string'
    })
    var optionValues = getNextArg(function (arg) {
      return arg instanceof Array
    })
    this.optionalAttributes = getNextArg(function (arg) {
      return !(arg instanceof Function) && arg instanceof Object
    })
    this.renderOption = args[curArgIndex]

    this.optionalAttributes = {
      allowAnyValue: true
    }
    if (this.optionalAttributes === undefined) this.optionalAttributes = {}
    if (this.optionalAttributes.allowAnyValue === undefined) this.optionalAttributes.allowAnyValue = true

    this.optionMap = new HashMap
    this.inputField = TextEditor()
    this.options = OptionsList(this, this.optionMap, this.renderOption)

    this.inputField.on('change', function () {
      that.prepareForValueChange([that.inputField.val])
      that.emit('change')
    })
    this.options.on('close', function () {
      that.close()
    })

    /*[label,]button, dropdown[, maintainDropdownPosition]*/
    superclass.build.call(this, label, Block(this.inputField, Svg('openArrow', dropdownArrow)), this.options) // superclass constructor

    optionValues.forEach(function (value) {
      that.option(value)
    })
  }


  // instance methods

  Object.defineProperty(this, 'val', {
    // returns the value that is selected
    get: function () {
      return this.inputField.text
        //            this.optionMap.forEach(function(optionGem, value) {
        //                if(this.get(value).selected) {
        //                    return this.get(value).val
        //                }
        //            })
    },

    set: function (value) {
      var option = this.optionMap.get(value)

      if (option === undefined || option.val !== value) {
        if (this.optionalAttributes.allowAnyValue) {
          this.inputField.text = value // assumes value is text // todo: maybe render the input value through this.renderOption, and when clicked on, hide the rendered option and show the texteditor
        } else {
          throw new Error("There is no Option in the Select with the value: '" + value + "'")
        }
      } else {
        option.selected = true
      }
    }
  })

  this.option = function ( /*[label,] value*/ ) {
    if (arguments.length === 1) {
      var value = arguments[0]
    } else if (arguments.length === 2) {
      var label = arguments[0]
      var value = arguments[1]
    } else {
      throw new Error("Invalid number of arguments")
    }

    var newOption = Option(label, value)
    this.options.add(newOption)

    return newOption

  }

  // same interface as Gem.remove
  /*override*/
  this.remove = function () {
    var that = this

    var removalIndexes = Gem.normalizeRemoveArguments.apply(this, arguments)
    var removals = removalIndexes.map(function (index) {
      return that.children[index]
    })

    superclass.remove.call(this, removalIndexes)

    // Select specific state modifications - this must be done after the superclass call in case an error is thrown from it
    var theSelectedWasRemoved = false
    removals.forEach(function (option) {
      if (option.selected) theSelectedWasRemoved = true
      delete that.optionMap.get(option.val)
    })

    if (theSelectedWasRemoved) {
      this.children[0].selected = true
      this.emit('change')
    }
  }


  // private

  this.prepareForValueChange = function (values) {
    var value = values[0]

    var that = this
    this.optionMap.forEach(function (optionGem, optionValue) {
      if (optionValue !== value) {
        var option = that.optionMap.get(optionValue)
        if (option.selected === true) {
          option.setSelectedQuiet(false)
        }
      }
    })
  }

  // should be called once a new value has been chosen via an option (if its written via the input field, its already there)
  this.changeValue = function (value) {
    this.inputField.text = value
  }
})

var OptionsList = proto(Gem, function (superclass) {

  // static variables

  this.name = 'OptionsList'

  this.build = function (combobox, optionMap, renderOption) {
    this.mainGem = combobox
    this.renderOption = renderOption
    this.optionMap = optionMap
  }

  // same interface as Gem.addAt
  /*override*/
  this.addAt = function (index /*, nodes...*/ ) {
    var that = this

    var nodesToAdd = Gem.normalizeAddAtArguments.apply(this, arguments)

    // validation first
    nodesToAdd.forEach(function (option) {
      if (that.optionMap.get(option.val) !== undefined) {
        throw new Error("Can't give an Option the same value as another in the Select (value: '" + option.val + "')")
      }
    })

    superclass.addAt.call(this, index, nodesToAdd)

    // Select specific state modifications - this must be done after the superclass call in case an error is thrown from it
    var anyWereSelected = false
    nodesToAdd.forEach(function (option) {
      // populate the option with the right view, depending on this.renderOption
      option.remove(option.children)
      option.add(that.renderOption(option.val))

      // Select specific state modifications - this must be done after the superclass call in case an error is thrown from it
      if (option.selected) anyWereSelected = true
      that.optionMap.set(option.val, option)

      // set up Select events
      // todo: remove events when the Option is removed
      option.on("mousedown", function (event) {
        that.mainGem.val = option.val // select this one
        that.emit('close')
      })
    })

    this.on('mousedown', function () {
      event.stopPropagation() // so that clicking on the options in the menu won't do things like close containing popups
    })

    if (anyWereSelected) {
      this.mainGem.emit('change')
    }
  }
})