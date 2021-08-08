/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/permission/article/tag" })

const tagController = require("../../../../controller/auth/article/tag")

router
	.post("/add", tagController.createTag) // 新建标签
	.post("/remove", tagController.removeTag) // 删除标签
	.post("/update", tagController.updateTag) // 编辑标签


module.exports = router
