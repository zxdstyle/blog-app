/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const jwt = require("jsonwebtoken")

const userService = require("../../service/permission/user")

module.exports = {
	// 获取用户信息
	getUser: async (ctx, next) => {
		await userService.getUser(ctx, next)
		ctx.body = {
			success: true,
			model: {
				username: "admin"
			}
		}
	},
}
