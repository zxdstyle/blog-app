/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:57
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const interfaces = require("os").networkInterfaces()


/**
 *
 * @param interfaces
 * @returns ip
 */
function theIP(){
	for (var devName in interfaces) {
		var iface = interfaces[devName]
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i]
			if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
				return alias.address
			}
		}
	}
}

const TYPE_MAP = {
	String: "[object String]",
	Array: "[object Array]",
	Object: "[object Object]",
	Number: "[object Number]",
	Boolean: "[object Boolean]",
	Undefined: "[object Undefined]",
	Null: "[object Null]",
	Function: "[object Function]",
	Symbol: "[object Symbol]",
}
function validateType(data, type) {
	if (!TYPE_MAP[type]) return false
	return Object.prototype.toString.call(data) === TYPE_MAP[type]
}


module.exports = {
	theIP,
	validateType,
}
