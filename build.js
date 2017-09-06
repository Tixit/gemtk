var fs = require('fs')
var path = require("path")
var buildModule = require("build-modules")

var buildDirectory = path.join(__dirname,'dist')
if(!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
}

var copywrite = '/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/\n'+generateGemModuleTranslations(
    ['Gem', 'Style', 'Block', 'Button', 'Canvas', 'CheckBox', 'Image', 'List',
            'Radio', 'Select', 'Svg', 'Table', 'Text', 'TextArea', 'TextField']
)

console.log('building and minifying...')
build('TextEditor', {
    output: {path:buildDirectory},
    header: copywrite, minify:false,
    externals : {proto:'proto', gem:'Gem', "gem/Style":'Style', "gem/Text":'Text'}
})


function build(relativeModulePath, options) {
    var emitter = buildModule(path.join(__dirname, '.', relativeModulePath), options)
    emitter.on('done', function() {
       console.log((new Date())+" - Done building "+relativeModulePath+"!")
    })
    emitter.on('error', function(e) {
       console.log(e)
    })
    emitter.on('warning', function(w) {
       console.log(w)
    })
}

function generateGemModuleTranslations(gems) {
    var result = []
    gems.forEach(function(gem) {
        result.push(gem+'=Gem.'+gem)
    })

    return 'var '+result.join(",")
}