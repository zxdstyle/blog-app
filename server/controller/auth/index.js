/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const svgCaptcha = require("svg-captcha")
const MD5 = require("crypto-js/md5")
const jwt = require("jsonwebtoken")

const authService = require("../../service/auth")

module.exports = {
	// code
	code: async (ctx, next) => {
		const captcha = await svgCaptcha.create({
			fontSize: 38,
			noise: 4,
			width: 86,
			height: 32,
			inverse: false,
			ignoreChars: "0oO1ilI",
			color: true,
			background: "#eee",
		})
		console.log("[captcha]: " + captcha.text)
		const md5_code = await MD5(captcha.text.toLowerCase()).toString()
		ctx.cookies.set(ctx.config.AUTH_CODE_COOKIE_NAME, md5_code, {
			domain: ctx.config.DOMAIN,
			maxAge: 1000 * 60 * 5,
			httpOnly: false,
		})
		ctx.set("Content-Type", "image/svg+xml")
		ctx.body = String(captcha.data)
	},
	// user login
	userLogin: async (ctx, next) => {
		const { email, pwd, code } = ctx.request.body
		const codeCookie = ctx.cookies.get(ctx.config.AUTH_CODE_COOKIE_NAME)

		if (!code) {
			ctx.body = {
				code: 200,
				error: "验证码不能为空",
				errorMsg: {
					message: "验证码不能为空",
				}
			}
			return
		}
		if (!email || !pwd) {
			ctx.body = {
				code: 200,
				error: "账号或密码不能为空",
				errorMsg: {
					message: "账号或密码不能为空",
				}
			}
			return
		}
		if (MD5(code.toLowerCase()).toString() !== codeCookie) {
			ctx.body = {
				code: 200,
				error: "验证码错误",
				errorMsg: {
					message: "验证码错误",
				}
			}
			return
		}

		// query sql
		try {
			const query = await authService.userLogin(ctx, next)
			if (query.success) {
				const payload = query.model
				ctx.cookies.set(ctx.config.AUTH_CODE_COOKIE_NAME, "", { signed: false, maxAge: 0 })
				const token = await jwt.sign(payload, ctx.config.SECRET, { expiresIn: 10 * 60 * 1000 })
				ctx.cookies.set(ctx.config.USER_TOKEN_COOKIE_NAME, token, {
					domain: ctx.config.DOMAIN,
					path: "/",
					maxAge: 10 * 60 * 1000,
					overwrite: false,
					httpOnly: true,
				})
				ctx.body = {
					...query,
					message: "登录成功!",
				}
			} else {
				ctx.body = {
					...query,
				}
			}
		} catch (err) {
			console.log(err)
			ctx.body = {
				...err,
			}
		}
	},
	// user logout
	userLogout: async (ctx, next) => {
		ctx.cookies.set(ctx.config.USER_TOKEN_COOKIE_NAME, "", { signed: false, maxAge: 0 })
		ctx.body = {
			status: 200,
			msg: "退出成功",
		}
	},
	// admin login
	adminLogin: async (ctx, next) => {

	},
}
