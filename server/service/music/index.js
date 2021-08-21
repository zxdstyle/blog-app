/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const { getFileHttpURL, handleRemoveFile } = require("../../util/upload")

module.exports = {
	// 后台查询歌曲
	getMusicByPage: async (ctx, next) => {
		try {
			let queryMsg = {}
			let { keyword, limit, page } = ctx.request.query
			limit = limit || 10
			page = page ? page - 1 : 0
			keyword = keyword || ""
			const { results } = await ctx.db(`
				SELECT
				m.id id, m.title title, m.singer singer, m.uuid uuid,
				res.filename url, res.type url_type, res.id url_id, res.uuid url_uuid, res.filename url_name, res.origin_name url_title,
				res1.filename poster, res1.type poster_type, res1.id poster_id, res1.uuid poster_uuid, res1.filename poster_name, res1.origin_name poster_title,
				m.createTime createTime
				from music m
				LEFT JOIN resource res on m.url_id=res.id
				LEFT JOIN resource res1 on m.poster_id=res1.id
				where title like '%${keyword}%' or singer like '%${keyword}%'
				limit ${page * limit},${limit}
			`)
			const temp = Array.from(results)
			const dataList = temp.map((m) => {
				const model = {
					...m,
					url: getFileHttpURL(ctx, m.url, m.url_type),
					poster: getFileHttpURL(ctx, m.poster, m.poster_type)
				}
				return model
			})
			const { results: totalResult } = await ctx.db(`
				SELECT * from music m
				LEFT JOIN resource res on m.url_id=res.id
				LEFT JOIN resource res1 on m.poster_id=res1.id
				where title like '%${keyword}%' or singer like '%${keyword}%'
			`)
			queryMsg = {
				message: "获取成功",
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
	// 添加歌曲
	createMusic: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { title, singer, url, poster } = ctx.request.body
			const { results: hasExist } = await ctx.db(`
				select * from music where title='${title}'
			`)
			if (hasExist && hasExist.length) {
				queryMsg = {
					code: 301,
					error: "添加失败，歌曲名已存在",
					errorMsg: {
						message: "添加失败，歌曲名已存在",
					},
					success: false,
				}
			} else {
				await ctx.db(
					'insert into music (uuid, title, singer, url_id, poster_id, createTime) values (UNIX_TIMESTAMP(), ?,?,?,?,now())',
					[title, singer, Number(url), Number(poster)]
				)
				queryMsg = {
					message: "添加成功",
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
	// 删除歌曲
	removeMusic: async (ctx, next) => {
		try {
			let queryMsg = {}
			const { uuid } = ctx.request.params
			const { results: hasExist } = await ctx.db(`
				SELECT  m.uuid uuid,
				res.filename url, res.type url_type, res.id url_id,
				res1.filename poster, res1.type poster_type, res1.id poster_id
				from music m
				LEFT JOIN resource res on m.url_id=res.id
				LEFT JOIN resource res1 on m.poster_id=res1.id
				where m.uuid='${uuid}'
			`)
			if (hasExist && !hasExist.length) {
				queryMsg = {
					code: 301,
					error: "删除失败，歌曲不存在",
					errorMsg: {
						message: "删除失败，歌曲不存在",
					},
					success: false,
				}
			} else {
				const deleteMusic = hasExist[0]
				const {
					url,
					url_type,
					url_id,
					poster,
					poster_type,
					poster_id,
				} = deleteMusic
				await ctx.db(`
					delete from music where uuid='${uuid}'
				`)
				await ctx.db(`
					delete from resource where id=${url_id} or id=${poster_id}
				`)
				await handleRemoveFile(ctx, url, url_type)
				await handleRemoveFile(ctx, poster, poster_type)
				queryMsg = {
					message: "删除成功",
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
	// 更新歌曲
	updateMusic: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			const { title, singer, url_id, poster_id } = ctx.request.body
			let queryMsg = {}
			const { results: hasExist } = await ctx.db(`
				select * from music where uuid='${uuid}'
			`)
			if (hasExist && !hasExist.length) {
				queryMsg = {
					code: 301,
					error: "更新失败，歌曲不存在",
					errorMsg: {
						message: "更新失败，歌曲不存在",
					},
					success: false,
				}
			} else {
				await ctx.db(
					'update music set title = ?, singer =? , url_id = ?, poster_id = ? where uuid = ?',
					[title, singer, url_id, poster_id, uuid]
				)
				queryMsg = {
					message: "更新成功",
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
	// 获取全部歌曲
	getAllMusic: async (ctx, next) => {
		try {
			let queryMsg = {}
			let { keyword } = ctx.request.query
			keyword = keyword || ""
			const { results } = await ctx.db(`
				SELECT  m.id id, m.title title, m.singer singer, res.filename url, m.uuid uuid,
				res1.id poster_id, res1.filename poster
				from music m
				LEFT JOIN resource res on m.url_id=res.id
				LEFT JOIN resource res1 on m.poster_id=res1.id
				where title like '%${keyword}%' or singer like '%${keyword}%'
			`)
			queryMsg = {
				message: "获取成功",
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
