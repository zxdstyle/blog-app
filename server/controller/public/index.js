/*
 *      Generic much page project.
 *  FileName:   index.js 公共
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const publicService = require("../../service/public")

module.exports = {
	// 上传文件
	uploadFile: async (ctx, next) => {
		try {
			const { FILE_TYPE } = ctx.request.body
			await ctx.validateField(FILE_TYPE, "FILE_TYPE参数不能为空")
			await ctx.validateField(ctx.request.files, "上传文件不能为空")
			const { file } = ctx.request.files
			await ctx.validateField(file, "上传文件不能为空")
			const query = await publicService.uploadFile(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
}
