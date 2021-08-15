/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const jwt = require("jsonwebtoken")

module.exports = {
	// 删除文章
	removeArticle: async (ctx, next) => {
		const { uuid } = ctx.request.params
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			if (results && results.length) {
				console.log(results)
				const removeId = results[0].id
				await ctx.db(`
					delete from article where id=${removeId}
				`)
				queryMsg = {
					message: "删除成功",
					success: true,
				}
			} else {
				queryMsg = {
					error: "删除错误,文章不存在",
					errorMsg: {
						message: "删除错误,文章不存在"
					}
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
	// 创建文章
	createArticle: async (ctx, next) => {
		const { title, intro, keyword, content, category, tags } = ctx.request.body
		try {
			let queryMsg = {}
			const userToken = ctx.cookies.get(ctx.config.USER_TOKEN_COOKIE_NAME)
			const token = await jwt.verify(userToken, ctx.config.SECRET)
			const { results: hasTitle } = await ctx.db(`select * from article where title='${title.trim()}'`)
			if (hasTitle && hasTitle.length) {
				queryMsg = {
					code: 301,
					success: false,
					error: "文章标题重复",
					errorMsg: {
						message: "文章标题重复"
					},
				}
			} else {
				const tag_ids = tags.join(",")
				await ctx.db(`
					insert into article 
					(uuid, user_id, title, intro, keyword, content, category_id, tag_ids, createTime) values
					(UNIX_TIMESTAMP(), ${token.id}, '${title}', '${intro}', '${keyword || ''}', '${content}', ${category},
					'${tag_ids}', NOW())
				`)
				queryMsg = {
					code: 200,
					success: true,
					message: "创建成功",
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
	// 获取文章列表
	getArticleList: async(ctx, next) => {
		let { limit, page, keyword, publish, category } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		publish = publish === undefined ? "" : publish
		category = category || ""
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select art.id id, art.uuid uuid, art.title title, art.intro intro,
				art.keyword keyword, GROUP_CONCAT(t.title) tags, art.tag_ids tag_ids,
				cate.title category, cate.id category_id,
				u.username username, res.filename avatar,
				art.publish publish, art.createTime createTime, art.updateTime updateTime
				from article art
				left join category cate on art.category_id=cate.id
				left join (user u left JOIN resource res on u.avatar_id=res.id ) on art.user_id=u.id
				LEFT JOIN tag t on FIND_IN_SET(t.id,art.tag_ids)
				where (art.title like '%${keyword}%' or art.intro like '%${keyword}%'
				or art.keyword like '%${keyword}%' or art.content like '%${keyword}%')
				and art.publish like '%${publish}%'
				and art.category_id like '${category}%'
				GROUP BY art.id
				limit ${page * limit},${limit}
			`)
			const dataList = results.map((item) => {
				const tagTitles = (item.tags || []).split(",")
				const tagIds = (item.tag_ids || []).split(",")
				const tags = []
				tagTitles.forEach((t, i) => {
					tags.push({
						id: Number(tagIds[i]),
						title: t,
					})
				})
				delete item.tag_ids
				return {
					...item,
					tags,
				}
			})
			const { results: totalResult } = await ctx.db(`
				select art.id id, art.uuid uuid, art.title title, art.intro intro,
				art.keyword keyword, GROUP_CONCAT(t.title) tags, art.tag_ids tag_ids,
				cate.title category, cate.id category_id,
				u.username username, res.filename avatar,
				art.publish publish, art.createTime createTime, art.updateTime updateTime
				from article art
				left join category cate on art.category_id=cate.id
				left join (user u left JOIN resource res on u.avatar_id=res.id ) on art.user_id=u.id
				LEFT JOIN tag t on FIND_IN_SET(t.id,art.tag_ids)
				where (art.title like '%${keyword}%' or art.intro like '%${keyword}%'
				or art.keyword like '%${keyword}%' or art.content like '%${keyword}%')
				and art.publish like '%${publish}%'
				and art.category_id like '${category}%'
				GROUP BY art.id
			`)
			queryMsg = {
				code: 200,
				success: true,
				data: dataList,
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
}
