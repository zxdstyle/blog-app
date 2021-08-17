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
				select *,
				(select count(*) from article where find_in_set(tag.id, article.tag_ids)) articles
				from tag
				where title like '%${keyword}%'
				limit ${page * limit},${limit}
			`)
			const { results: totalResult } = await ctx.db(`
				select *,
				(select count(*) from article where find_in_set(tag.id, article.tag_ids)) articles
				from tag
				where title like '%${keyword}%'
			`)
			queryMsg = {
				code: 200,
				success: true,
				data: Array.from(results),
				total: totalResult.length,
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
	// 新建标签
	createTag: async(ctx, next) => {
		let { title } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from tag
				where title='${title}'
			`)
			if (results && results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "标签已存在",
					errorMsg: {
						message: "标签已存在"
					},
				}
			} else {
				const { results: createQuery } = await ctx.db(`
					insert into tag (title, createTime) values ('${title}', NOW())
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
	// 删除标签
	removeTag: async(ctx, next) => {
		let { id } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from tag
				where id=${id}
			`)
			if (results && !results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "删除失败，标签不存在",
					errorMsg: {
						message: "删除失败，标签不存在"
					},
				}
			} else if (results && results.length) {
				const { results: hasTagArticles } = await ctx.db(`
					select id from article where find_in_set(${id}, tag_ids)
				`)
				if (hasTagArticles && hasTagArticles.length) {
					queryMsg = {
						code: 301,
						success: false,
						error: `删除失败，请先删除此标签 ${hasTagArticles.length} 篇文章`,
						errorMsg: {
							message: `删除失败，请先删除此标签 ${hasTagArticles.length} 篇文章`,
						},
					}
				} else {
					await ctx.db(`
						delete from tag where id=${id}
					`)
					queryMsg = {
						code: 200,
						success: true,
					}
				}
			} else {
				await ctx.db(`
					delete from tag where id=${id}
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
	// 编辑标签
	updateTag: async(ctx, next) => {
		let { id, title } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from tag
				where id=${id}
			`)
			if (results && !results.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "编辑失败，标签不存在",
					errorMsg: {
						message: "编辑失败，标签不存在"
					},
				}
			} else if(results && results.length){
				const { results: existTitleResult } = await ctx.db(`
					select * from tag where title='${title.trim()}'
				`)
				if (existTitleResult && existTitleResult.length) {
					queryMsg = {
						code: 301,
						success: false,
						error: "编辑失败，标签名称重复",
						errorMsg: {
							message: "编辑失败，标签名称重复"
						},
					}
				} else {
					await ctx.db(`
						update tag set title = '${title.trim()}' where id=${id}
					`)
					queryMsg = {
						code: 200,
						success: true,
					}
				}
			} else {
				await ctx.db(`
					update tag set title = '${title.trim()}' where id=${id}
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
