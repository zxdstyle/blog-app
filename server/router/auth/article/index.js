/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */


const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/auth/article" })

const articleControl = require("../../../controller/auth/article")

router
	.get("/list", articleControl.getArticleList)
	.get("/detail/:uuid", articleControl.getArticleDetail)


module.exports = router
