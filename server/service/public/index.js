/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const { handleUpload, getFileHttpURL } = require("../../util/upload")

module.exports = {
	uploadFile: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { FILE_TYPE } = ctx.request.body
			const { file } = ctx.request.files
			const { name, ext, size, type, originName } = await handleUpload(ctx, file, FILE_TYPE)
			const { results } = await ctx.db(
				'insert into resource (type, filename, origin_name, ext, size, createTime) values (?,?,?,?,?,now())',
				[type, name, originName, ext, size]
			)
			const { insertId } = results
			queryMsg = {
				model: {
					id: insertId,
					filename: name,
					url: getFileHttpURL(ctx, name, type),
					ext,
					size,
					type,
					origin_name: originName,
				},
				success: true,
				message: "上传成功",
			}
			return queryMsg
		} catch (error) {
			return {
				code: 500,
				errorMsg: {
					message: error.message,
				},
				...error,
			}
		}
	},
}
