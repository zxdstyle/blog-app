/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const jwt = require("jsonwebtoken")

module.exports = {
	// 删除评论
	removeComment: async (ctx, next) => {
		const { id } = ctx.request.params
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from comment where id=${id}
			`)
			if (results && results.length) {
				await ctx.db(`
					delete from comment where id=${id}
				`)
				queryMsg = {
					message: "操作成功",
					success: true,
				}
			} else {
				queryMsg = {
					error: "删除失败,评论不存在",
					errorMsg: {
						message: "删除失败,评论不存在"
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
	// 回复评论
	replyComment: async (ctx, next) => {
		const { uuid } = ctx.request.params
		const { username, content, email, target_name, target_id } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select * from article where uuid='${uuid}'
			`)
			if (results && results.length) {
				await ctx.db(`
					insert into comment (username, email, article_id, target_id, target_name, content, createTime)
					values ('${username}', '${email}', '${uuid}', ${target_id}, '${target_name}', '${content}', NOW())
				`)
				queryMsg = {
					message: "操作成功",
					success: true,
				}
			} else {
				queryMsg = {
					error: "文章不存在",
					errorMsg: {
						message: "文章不存在"
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
	// 获取文章评论
	getArticleComments: async (ctx, next) => {
		const { uuid } = ctx.request.params
		let { limit, page } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0 
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			if (results && results.length) {
				const { results: comments } = await ctx.db(`
					select
					com.id id, com.username username, com.email email, com.article_id article_id,
					art.title article_title, com.target_id target_id, com.content content,
					com.target_name target_name, com.ip ip, com.brower brower, com.createTime createTime
					from comment com
					left join article art on art.uuid=com.article_id
					where article_id=${uuid}
					order by createTime DESC
					limit ${page * limit},${limit}
				`)
				const { results: totalResult } = await ctx.db(`
					select
					com.id id, com.username username, com.email email, com.article_id article_id,
					art.title article_title, com.target_id target_id, com.content content,
					com.target_name target_name, com.ip ip, com.brower brower, com.createTime createTime
					from comment com
					left join article art on art.uuid=com.article_id
					where article_id=${uuid}
					order by createTime DESC
				`)
				queryMsg = {
					message: "获取成功",
					success: true,
					data: comments,
					total: totalResult.length,
				}
			} else {
				queryMsg = {
					data: [],
					error: "文章不存在",
					errorMsg: {
						message: "文章不存在"
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
	// 获取文章详情
	getArticleDetail: async (ctx, next) => {
		const { uuid } = ctx.request.params
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			if (results && results.length) {
				const { results: curArticle } = await ctx.db(`
					select art.id id, art.uuid uuid, art.title title, art.intro intro, art.content content,
					art.keyword keyword, GROUP_CONCAT(t.title) tags, art.tag_ids tag_ids,
					art.is_link is_link, art.is_original is_original, art.view_times view_times,
					art.is_top is_top, art.link_url link_url,
					cate.title category, cate.id category_id,
					u.username username, res.filename avatar,
					art.publish publish, art.createTime createTime, art.updateTime updateTime
					from article art
					left join category cate on art.category_id=cate.id
					left join (user u left JOIN resource res on u.avatar_id=res.id ) on art.user_id=u.id
					LEFT JOIN tag t on FIND_IN_SET(t.id,art.tag_ids)
					where art.uuid='${uuid}'
					GROUP BY art.id
				`)
				const theArticle = curArticle[0]
				const { tags, tag_ids } = theArticle
				const tagTitles = (tags || []).split(",")
				const tagIds = (tag_ids || []).split(",")
				const tagList = []
				tagTitles.forEach((t, i) => {
						tagList.push({
							id: Number(tagIds[i]),
							title: t,
						})
					})
				theArticle.tags = tagList
				delete theArticle.tag_ids
				queryMsg = {
					message: "获取成功",
					success: true,
					model: theArticle,
				}
			} else {
				queryMsg = {
					model: null,
					error: "文章不存在",
					errorMsg: {
						message: "文章不存在"
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
	// 更新文章
	updateArticle: async (ctx, next) => {
		const { uuid } = ctx.request.params
		const { title, intro, keyword, content, category, tags, is_link, link_url, is_original, is_top, publish } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			const articleId = results[0].id
			if (results && results.length) {
				const tag_ids = tags.join(",")
				await ctx.db(
					`update article
					set title=?, intro=?, keyword=?, content=?, category_id=?,
					tag_ids=?, is_link=?, link_url=?, is_original=?, is_top=?, publish=? where id=?`,
					[title, intro, keyword, content, category, tag_ids, is_link, link_url, is_original, is_top, publish, articleId]
				)
				queryMsg = {
					message: "更新成功",
					success: true,
				}
			} else {
				queryMsg = {
					error: "更新错误,文章不存在",
					errorMsg: {
						message: "更新错误,文章不存在"
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
	// 删除文章
	removeArticle: async (ctx, next) => {
		const { uuid } = ctx.request.params
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			if (results && results.length) {
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
		const { title, intro, keyword, content, category, tags, is_link, link_url, is_original, is_top, publish } = ctx.request.body
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
				await ctx.db(
					`insert into article
					(uuid, title, intro, keyword, content, user_id, category_id, tag_ids, is_link, link_url, is_original, is_top, publish, createTime)
					values(UNIX_TIMESTAMP(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`,
					[title, intro, keyword, content, token.id, category, tag_ids, is_link, link_url, is_original, is_top, publish]
				)
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
		let { limit, page, keyword, publish, category, is_link, is_original } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		publish = publish === undefined ? "" : publish
		category = category || ""
		is_link = is_link || ""
		is_original = is_original || ""
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select art.id id, art.uuid uuid, art.title title, art.intro intro,
				art.keyword keyword, GROUP_CONCAT(t.title) tags, art.tag_ids tag_ids,
				art.is_link is_link, art.is_original is_original, art.view_times view_times,
				art.is_top is_top, art.link_url link_url,
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
				and art.is_link like '${is_link}%'
				and art.is_original like '${is_original}%'
				GROUP BY art.id
				ORDER BY art.is_top DESC, art.is_original DESC, art.createTime DESC
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
				and art.is_link like '${is_link}%'
				and art.is_original like '${is_original}%'
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
	// 前台获取文章列表
	getClientArticleList: async(ctx, next) => {
		let { limit, page, keyword, category, tag } = ctx.request.query
		limit = limit || 10
		page = page ? page - 1 : 0
		keyword = keyword || ""
		category = category || ""
		tag = tag || ""
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select art.id id, art.uuid uuid, art.title title, art.intro intro,
				art.keyword keyword, GROUP_CONCAT(t.title) tags, art.tag_ids tag_ids,
				art.is_link is_link, art.is_original is_original, art.view_times view_times,
				art.is_top is_top, art.link_url link_url,
				cate.title category, cate.id category_id,
				u.username username, res.filename avatar,
				art.publish publish, art.createTime createTime, art.updateTime updateTime
				from article art
				left join category cate on art.category_id=cate.id
				left join (user u left JOIN resource res on u.avatar_id=res.id ) on art.user_id=u.id
				LEFT JOIN tag t on FIND_IN_SET(t.id,art.tag_ids)
				where (art.title like '%${keyword}%' or art.intro like '%${keyword}%'
				or art.keyword like '%${keyword}%' or art.content like '%${keyword}%')
				and art.publish=1
				and art.category_id like '${category}%'
				and art.tag_ids like '${tag}%'
				GROUP BY art.id
				ORDER BY art.is_top DESC, art.is_original DESC, art.createTime DESC
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
				and art.publish=1
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
	// 置顶文章
	toggleTop: async (ctx, next) => {
		const { uuid } = ctx.request.params
		const { top } = ctx.request.body
		try {
			let queryMsg = {}
			const { results } = await ctx.db(`
				select id from article where uuid='${uuid}'
			`)
			if (results && results.length) {
				const articleId = results[0].id
				await ctx.db(`
					update article set is_top=${top} where id=${articleId}
				`)
				queryMsg = {
					message: "操作成功",
					success: true,
				}
			} else {
				queryMsg = {
					error: "操作错误,文章不存在",
					errorMsg: {
						message: "操作错误,文章不存在"
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
}
