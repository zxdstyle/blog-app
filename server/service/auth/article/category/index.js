/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

module.exports = {
	// 获取分类列表
	getCategoryList: async(ctx, next) => {
		let { limit, page, keyword } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from category
				where title like '%${keyword}%'
				limit ${page * limit},${limit}
			`)
			const { results: totalResults } = await ctx.db(`
				select * from category
				where title like '%${keyword}%'
			`)
			queryMsg = {
				code: 200,
				success: true,
				data: Array.from(results),
				total: totalResults.length,
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
	// 新建分类
	createCategory: async(ctx, next) => {
		let { title } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from category
				where title='${title}'
			`)
			if (results && results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "分类已存在",
					errorMsg: {
						message: "分类已存在"
					},
				}
			} else {
				const { results: createQuery } = await ctx.db(`
					insert into category (title, createTime) values ('${title}', NOW())
				`)
				queryMsg = {
					code: 200,
					success: true,
					model: createQuery[0],
				}
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
	// 删除分类
	removeCategory: async(ctx, next) => {
		let { id } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from category
				where id=${id}
			`)
			if (results && !results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "删除失败，分类不存在",
					errorMsg: {
						message: "删除失败，分类不存在"
					},
				}
			} else {
				await ctx.db(`
					delete from category where id=${id}
				`)
				queryMsg = {
					code: 200,
					success: true,
				}
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
	// 编辑分类
	updateCategory: async(ctx, next) => {
		let { id, title } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from category
				where id=${id}
			`)
			if (results && !results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "编辑失败，分类不存在",
					errorMsg: {
						message: "编辑失败，分类不存在"
					},
				}
			} else if(results && results.length){
				const { results: existTitleResult } = await ctx.db(`
					select * from category where title='${title.trim()}'
				`)
				if (existTitleResult && existTitleResult.length) {
					queryMsg = {
						code: 301,
						success: false,
						error: "编辑失败，分类名称重复",
						errorMsg: {
							message: "编辑失败，分类名称重复"
						},
					}
				} else {
					await ctx.db(`
						update category set title = '${title.trim()}' where id=${id}
					`)
					queryMsg = {
						code: 200,
						success: true,
					}
				}
			} else {
				await ctx.db(`
					update category set title = '${title.trim()}' where id=${id}
				`)
				queryMsg = {
					code: 200,
					success: true,
				}
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
