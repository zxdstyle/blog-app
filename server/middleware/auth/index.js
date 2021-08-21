/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const jwt = require("jsonwebtoken")
const { logger } = require("../log")

// api black list(RegExp)
const apiBlackList = ["^/api/permission", "^/admin$"]

module.exports = async (ctx, next) => {
	const hasBlackItem = apiBlackList.filter(item => {
		let reg = new RegExp(item, "g")
		let flag = reg.test(ctx.request.url)
		return flag
	}).length > 0

	if (!hasBlackItem) {
		const userToken = ctx.cookies.get(ctx.config.USER_TOKEN_COOKIE_NAME)
		if (userToken) {
			try	{
				await jwt.verify(userToken, ctx.config.SECRET)
				// 若果已登录
				if (ctx.request.url === "/login") {
					ctx.redirect("/")
				}
			} catch (error) {
				logger.error("[Validate token fail]," + error)
			}
		}
		await next()
	} else {
		const preToken = ctx.cookies.get(ctx.config.USER_TOKEN_COOKIE_NAME)
		try {
			const tokenData = await jwt.verify(preToken, ctx.config.SECRET)
			const payload = Object.assign({}, tokenData)
			delete payload.iat
			delete payload.exp
			const token = await jwt.sign(payload, ctx.config.SECRET, { expiresIn: ctx.config.COOKIE_TIME })
			ctx.cookies.set(ctx.config.USER_TOKEN_COOKIE_NAME, token, {
				domain: ctx.config.DOMAIN,
				path: "/",
				maxAge: ctx.config.COOKIE_TIME,
				overwrite: false,
				httpOnly: true,
			})
			await next()
		} catch (error) {
			if (ctx.isDev) {
				ctx.status = 401
				ctx.body = {
					...error,
					error: "FAIL TOKEN AUTHORIZATION",
					name: "AUTHORIZATION",
					message: "FAIL TOKEN AUTHORIZATION",
					code: 401,
					errorMsg: {
						message: "请先登录...",
					}
				}
				return
			}
			ctx.redirect("/login")
			logger.error("[Validate token fail]," + error)
			
		}
	}
}
