/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

module.exports = {
	// 获取标签列表
	getTagList: async(ctx, next) => {
		let { limit, page, keyword } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from tag
				where title like '%${keyword}%'
				limit ${page * limit},${limit}
			`)
			queryMsg = {
				code: 200,
				success: true,
				data: Array.from(results),
				total: results.length,
			}
			return queryMsg
		} catch (error) {
			return {
				code: 500,
				errorMsg: {
					message: error.message,
				},
				error,
			}
		}
	},
}
