
`gemtk`
=====

`gemtk` is a toolkit of Gem components for [Gem.js](https://github.com/Tixit/Gem.js).


Install
=======

```
npm install gemtk
```

### Requirements

Requires the npm modules: [`proto`](https://github.com/fresheneesz/proto) and [`gem`](https://github.com/Tixit/Gem.js).

The `gemtk` Gems
================

Each gemtk Gem can be accessed via one of the following ways:

```javascript
// common js module format (like node.js)
var GemName = require('gemtk/GemName')

// amd (eg require.js)
require.config({paths: {'GemName': 'node_modules/gemtk/dist/GemName.umd.js'}})
require(['GemName'], function(dd) { /* your code */ })

// global variable
<script src="node_modules/gemtk/dist/GemName.umd.js"></script>
GemName; // GemName.umd.js can define the Gem globally if you really
       //   want to shun module-based design
```

For example, the TextEditor Gem can be accessed with via common js in the following way:

```javascript
var TextEditor = require('gemtk/TextEditor')
```

### TextEditor

**`var editor = TextEditor([label,] options)`**
* `label` - The label to give the gem.
* `options`
  * characterFilter - A function that's passed a character from the 'keydown' event, and should return true if the character is allowable
  * emptyText - Text to be displayed when the field is undefined
  * initial - The initial value
  * proxyEvents - A list of events to proxy. Defaults to ['blur', 'focus']

**`editor.text`** - Gets or sets the text value. \
**`editor.val`** - Same as `editor.text`\
**`editor.focus`** - Just like the `focus` getter/setter for basic Gems. \
**`editor.selectionRange`** - Just like the `selectionRange` getter/setter for basic Gems.

`editor` can emit the following events:
* **`change()`** - Emitted when the value changes.

### Dropdown

A button that can open and close a custom dropdown component.

**`var dropdown = Dropdown([label,]button, dropdown[, maintainDropdownPosition])`**
* `label` - The label to give the gem.
* `button` - The gem to be displayed as the button of the dropdown. Note that this is mutated by being given the label `'button'`.
* `dropdown` - The component to display when the Dropdown is opened. Note that this is mutated by being given the label `'menu'`.
  * `dropdown.state`:`direction` - set to either 1 if the menu is displayed below the button, and -1 if the menu is displayed above the button
  * `dropdown.state`:`height` - set to the height of the dropdown if the height  needs to be constrained, undefined if it doesn't need to be constrained (this is useful to do things like set 'overflow' to 'scroll' for example)
  * `dropdown.getPotentialHeight()` - (optional) If available, called to get the full potential height of the dropdown. If not available, defaults to the dropdown's scrollHeight
  * `dropdown.getPotentialWidth()` - (optional) If available, called to get the full potential width of the dropdown. If not available, defaults to the dropdown's scrollWidth
* `maintainDropdownPosition` - (default:true) If true, while the dropdown is open, it will be repositioned constantly so that it tracks the movement of the button Component

**`dropdown.button`** - Points to the passed in `button` gem.  
**`dropdown.menu`** - Points to the passed in `menu` gem.  
**`dropdown.isOpen`** - Returns true if the dropdown is currently open, false otherwise.

**`dropdown.open()`** - When called, the menu is displayed.  
**`dropdown.close()`** - When called, the menu is hidden.  
**`dropdown.toggle()`** - Will open the menu if its currently close, and vice versa.

`dropdown` can emit the following events:
* **`open`** - emitted when the dropdown is opened
* **`close`** - emitted when the dropdown is closed

`dropdown` can internally set its state with the following **`state`** properties:
* **`direction`** - Vertical direction. Can either be 1 or -1. 1 means the menu is displayed below its button, -1 means the menu is displayed above its button.
* **`horizontalDirection`** - Either 1 or -1. 1 means the menu extends beyond the right side of the button, -1 means the menu extends beyond the left side of the button.
* **`height`** - Can either be `undefined`, or a number. If `undefined`, it means the height is not constrained. If defined, it gives the height in pixels the menu is constrained to.
* **`width`** - Can either be `undefined`, or a number. If `undefined`, it means the width is not constrained. If defined, it gives the width in pixels the menu is constrained to.

Note that in styling a `Dropdown`, you can style the menu (using $menu, or its gem selector) as if it were an actual child

### DropButton

This is a `Dropdown` that opens and closes on click. Inherits all properties from `Dropdown`.

### ComboBox

A Dropdown that has a text input as well as a number of select options that can populate the text box. This has a similar api to the `Select` gem.

**`var combobox = ComboBox([label,] optionValues, optionalAttributes, renderOption)`**
* `label` - The label to give the gem.
* optionValues - An array of values the dropdown is populated with.
* renderOption(option) - Takes in an option value and returns a block displaying that value.
* optionalAttributes - An object that can contain the keys:
  * allowAnyValue (default: true) - If true, any value can be input. If false, it will error if a value not listed in the options is set.

**`combobox.val`** - Gets or sets the value of the `combobox`

**`combobox.option([label,] value)`** - Creates a new option in the list of combobox options. Returns the newly created `Option` object.

`combobox` can emit the following events:
* **`change`** - event when its value is changed

### Option

Represents an `<option>` node. Is note intended to be used directly. Is used by `ComboBox`.

**`var option = Option([label,] value)`**
* `label` - The label to give the gem.
* optionValues - The value the option will have

**`option.selected`** - Gets or sets whether the option is selected.  
**`option.val`** - Sets the option to have a different value.


`option` can emit the following events:
* **`change`** - Emitted when its `selected` value changes

Note that an `Option` object relies on its `parent` that has a `mainGem` property that in turn has an `options` map that maps the string `value` of an option to the `Option` object that value corresponds to. If the `Option` object is selected, it will call `mainGem.prepareForValueChange` on its parent, will call `mainGem.changeValue` on its parent, and will emit a `change` event on the `mainGem` of its parent.

### utils

The `utils` module contains some helpful dom or gem functions.

**Gem Utils:**

**`utils.getStandaloneStyle(psuedoparent, gem, pseudoparentStyle)** - Returns a `Style` that can be applied to 'gem' so that 'gem' will get styled as if it were a child of `pseudoparent`.

**`utils.getStylePxAmount(style, property)`** - Gets the value of a css style as a numerical value.
* `style` - A object returned from `window.getComputedStyle`
* `property` - A css property

**Dom Utils:**

**`findOverflowView(domNode, axis)`** - Returns the closest ancestor dom node that has a non-visible scroll type for the given axis.
* `axis` - Either 'x' or 'y'

**`isPointOver(x,y, element)`** - Returns `true` if the point intersects the element's bounds, `false` otherwise.

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. When you're done, run the unit tests and ensure they all pass
7. Commit and push your changes
8. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

Change Log
=========
* 0.1.0 - first commit!

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT