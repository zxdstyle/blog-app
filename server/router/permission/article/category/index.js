/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/permission/article/category" })

const cateController = require("../../../../controller/auth/article/category")

router
	.post("/add", cateController.createCategory) // 新建分类
	.post("/remove", cateController.removeCategory) // 删除分类
	.post("/update", cateController.updateCategory) // 编辑分类


module.exports = router
