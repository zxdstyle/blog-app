/*
 *      Generic much page project.
 *  FileName:   route.js
 *  Create On:  2020/11/29 15:45
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const fs = require("fs")
const path = require("path")
const Vue = require("vue")
const template = fs.readFileSync(path.resolve(__dirname, "../template/soul.html"), "utf8")
const renderer = require("vue-server-renderer").createRenderer({
	template,
})
const Route = require("koa-router")
const router = new Route()
const { routes } = require("../config")

router.use(...routes)
	.get("/soul", async (ctx, next) => {
		try {
			if (ctx.isDev) {
				ctx.status = 404
				ctx.body = {
					code: 404,
					error: "404,资源不存在...",
					errorMsg: {
						message: "404,资源不存在",
						errorURL: ctx.request.query.errorURL
					}
				}
				return
			}
			const vueCtx = {
				title: "404,资源不存在..."
			}
			const app = new Vue({
				template: `<span></span>`,
			})
			renderer.renderToString(app, vueCtx)
				.then((html) => {
					ctx.set("Content-type", "text/html")
					ctx.body = html
				})
		} catch (error) {
			console.log(error)
			ctx.body = {
				...error,
			}
		}
	})

module.exports = router
