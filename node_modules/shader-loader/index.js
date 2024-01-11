var path = require('path')
var fs = require('fs')
var loaderUtils = require('loader-utils')

var chunks = {}
var chunkPath = ""

module.exports = function(source) {
	this.cacheable && this.cacheable()

	var uid = new Object()
		uid.callback = this.async()
		uid.finalString = source
		uid.queue = 0
		uid.done = false

	var options = loaderUtils.getOptions(this) || {}

	if(options.glsl && options.glsl.chunkPath){
		chunkPath =  options.glsl.chunkPath
	}

	var r = /\$[\w-.]+/gi
	var match = source.match( r )

	if(match){
		for (var i = 0; i < match.length; i++) {
			chunks[match[i]] = ""
		}
	} else {
		onChunksLoaded.call(uid)
	}

	var keys = []
	for (var key in chunks){
		keys.push(key)
	}
	keys.sort()
	keys.reverse()
	uid.queue+=keys.length

	for(var i=0; i < keys.length; i++){
		loadChunk.call(this, keys[i], uid )

	}
}

function loadChunk(key, uid){
	var name = key.substr(1, key.length-1)
	var headerPath = path.resolve(chunkPath+"/"+name+".glsl");
	this.dependency(headerPath)
	fs.readFile(headerPath, "utf-8", function(err, content) {
		uid.queue--
		chunks[key]=content
		if(err) {
			chunks[key]=""
			console.error("Can't open the shader chunk "+name+":\n"+err.toString())
		}
		if(uid.queue==0){
			onChunksLoaded.call(uid)
		}
	})

}

function onChunksLoaded(){
	if(this.done){ return }
	this.done = true
	var keys = []
	for (var key in chunks){
		keys.push(key)
	}
	keys.sort()
	keys.reverse()
	for(var i=0; i < keys.length; i++){
		var key = keys[i]
		var re = new RegExp("(\\"+key+")", "gi")
		this.finalString = this.finalString.replace(re,chunks[key])
	}

	this.finalString = "module.exports = " + JSON.stringify(this.finalString)
	this.callback(null, this.finalString)
}
