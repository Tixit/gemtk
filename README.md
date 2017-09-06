
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
* `change()` - Emitted when the value changes.

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