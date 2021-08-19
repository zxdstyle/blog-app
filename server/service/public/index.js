/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const { handleUploadFile, getFileHttpURL, handleRemoveFile } = require("../../util/upload")

module.exports = {
	// 上传文件
	uploadFile: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { FILE_TYPE } = ctx.request.body
			const { filedata } = ctx.request.files
			const { name, ext, size, type, originName } = await handleUploadFile(ctx, filedata, FILE_TYPE)
			const { results } = await ctx.db(
				'insert into resource (uuid, type, filename, origin_name, ext, size, createTime) values (UNIX_TIMESTAMP(),?,?,?,?,?,now())',
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
	removeFile: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { uuid } = ctx.request.params
			const { results: hasExist } = await ctx.db(`
				select * from resource where uuid='${uuid}'
			`)
			if (hasExist && !hasExist.length) {
				queryMsg = {
					error: "删除失败,资源不存在",
					errorMsg: {
						message: "删除失败,资源不存在",
					},
				}
			} else {
				const { type, filename } = hasExist[0]
				await handleRemoveFile(ctx, filename, type)
				await ctx.db(`delete from resource where uuid='${uuid}'`)
				queryMsg = {
					success: true,
					message: "删除成功"
				}
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
