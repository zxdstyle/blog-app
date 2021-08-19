/*
 *      Generic much page project.
 *  FileName:   index.js 公共api
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/permission/public" })

const publicController = require("../../../controller/public")

router
	.post("/upload", publicController.uploadFile) // 上传文件
	.post("/remove-file/:uuid", publicController.removeFile) // 删除文件


module.exports = router
