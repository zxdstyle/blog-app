/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const MD5 = require("crypto-js/md5")

module.exports = {
	// user login
	userLogin: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { email, pwd } = ctx.request.body
			const { results } = await ctx.db(`select * from user where email='${email}'`)
			if (results && results.length) {
				const model = results[0];
				if (model.password === pwd) {
					delete model.password
					queryMsg = {
						code: 200,
						success: true,
						model: Object.assign({}, model),
					}
				} else {
					queryMsg = {
						code: 200,
						error: "账号或密码错误",
						errorMsg: {
							message: "账号或密码错误",
						}
					}
				}
			} else {
				queryMsg = {
					code: 200,
					error: "账号或密码错误",
					errorMsg: {
						message: "账号或密码错误",
					}
				}
			}
			return queryMsg
		} catch (err) {
			return {
				code: 500,
				errorMsg: {
					message: err.message,
				},
				error: err,
			}
		}
	},
}
