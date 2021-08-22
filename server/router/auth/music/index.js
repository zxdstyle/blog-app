/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const koaRouter = require("koa-router")
const router = new koaRouter({ prefix: "/api/music" })

const musicController = require("../../../controller/music")

router
	// .get("/all", musicController.getAllMusic)
	.get("/random", musicController.getRandomMusic)
	.get("/current/:uuid", musicController.getCurrentMusic)
	.get("/search", musicController.getSearchMusic)


module.exports = router
