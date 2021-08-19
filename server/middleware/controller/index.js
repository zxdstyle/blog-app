/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:42
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const { validateType } = require("../../util")

module.exports = async (ctx, next) => {
	ctx.validateField = async (field, errorMsg, cb) => {
		try {
			if (!field) {
				const error = new Error(errorMsg)
				error.code = 401
				error.errorMsg = {
					message: errorMsg
				}
				error.error = errorMsg
				if (cb && validateType(cb, "Function")) {
					await cb(error)
				}
				throw error
			} else if (field) {
				if (validateType(field, "String") || validateType(field, "Array")) {
					if(!field.length) {
						const error = new Error(errorMsg)
						error.code = 401
						error.errorMsg = {
							message: errorMsg
						}
						error.error = errorMsg
						if (cb && validateType(cb, "Function")) {
							await cb(error)
						}
						throw error
					}
				}
				if (validateType(field, "Object")) {
					if(!Object.keys(field).length) {
						const error = new Error(errorMsg)
						error.code = 401
						error.errorMsg = {
							message: errorMsg
						}
						error.error = errorMsg
						if (cb && validateType(cb, "Function")) {
							await cb(error)
						}
						throw error
					}
				}
			}
		} catch (err) {
			throw err
		}
	}

	ctx.contrastField = async (fields, errorMsg, cb) => {
		if (cb && validateType(cb, "Function")) {
			const flag = await cb(...fields)
			if (!flag) {
				const error = new Error(errorMsg)
				error.code = 401
				error.errorMsg = {
					message: errorMsg
				}
				error.error = errorMsg
				throw error
			}
		} else {
			let flag = false
			const contrastSet = new Set()
			fields.forEach(field => {
				contrastSet.add(field)
			})
			flag = contrastSet.size > 1
			if (flag) {
				const error = new Error(errorMsg)
				error.code = 401
				error.errorMsg = {
					message: errorMsg
				}
				error.error = errorMsg
				throw error
			}
		}
	}
	await next()
}
