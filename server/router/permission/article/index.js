/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/permission/article" })

const articleController = require("../../../controller/auth/article")

router
	.get("/list", articleController.getArticleList)
	.get("/detail/:uuid", articleController.getArticleDetail)
	.post("/create", articleController.createArticle)
	.post("/remove/:uuid", articleController.removeArticle)
	.post("/update/:uuid", articleController.updateArticle)
	.post("/toggletop/:uuid", articleController.toggleTop)
	.post("/comments/:id/remove", articleController.removeComment)
	


module.exports = router
