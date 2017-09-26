var fs = require('fs')
var path = require("path")
var buildModule = require("build-modules")

var buildDirectory = path.join(__dirname,'dist')
if(!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
}

var copywrite = '/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/'

console.log('building and minifying...')

var gemModules = ['Style','Block','Button','Canvas','CheckBox','Image','List','Radio','Select','Svg','Table','Text','TextArea','TextField']
var gemModulePaths = gemModules.map(function(module) {
    return 'gem/'+module
})
var externalModules = ['proto','gem'].concat(gemModulePaths)

var header = gemModules.map(function(moduleName){
    return 'window["gem/'+moduleName+'"]=Gem.'+moduleName
}).join(';')+';window.gem=Gem;'

var toolkitGems = ['TextEditor', 'Dropdown', 'DropButton', 'Option', 'ComboBox']

toolkitGems.forEach(function(gem) {
    build(gem, {
        output: {path:buildDirectory}, minify:false,
        header: header,
        externals: externalModules
        //externals : {proto:'proto', gem:'Gem', "gem/Style":['Gem','Style'], "gem/Text":["Gem",'Text']}  // this is broken in webpack currently : (
    })
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