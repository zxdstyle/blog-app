/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

module.exports = {
	// 获取文章列表
	getArticleList: async(ctx, next) => {
		let { limit, page, keyword, publish } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		publish = publish === undefined ? "" : publish
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select art.id id, art.uuid uuid, art.title title, art.intro intro,
				art.keyword keyword, art.content content, u.username username,
				res.filename avatar, art.publish publish, art.createTime createTime,
				art.updateTime updateTime
				from article art
				left join category cate on art.category_id=cate.id
				left join (user u left JOIN resource res on u.avatar_id=res.id ) on art.user_id=u.id
				where (art.title like '%${keyword}%' or art.intro like '%${keyword}%'
				or art.keyword like '%${keyword}%' or art.content like '%${keyword}%')
				and art.publish like '%${publish}%'
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
