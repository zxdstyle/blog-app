/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

const musicService = require("../../service/music")

module.exports = {
	// 后台查询歌曲
	getMusicByPage: async (ctx, next) => {
		try {
			const query = await musicService.getMusicByPage(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 新增歌曲
	createMusic: async (ctx, next) => {
		try {
			const { title, singer, url, poster } = ctx.request.body
			await ctx.validateField(title, "歌曲名不能为空")
			await ctx.validateField(singer, "歌手不能为空")
			await ctx.validateField(url, "请上传歌曲")
			await ctx.validateField(poster, "请上传歌曲封面")
			const query = await musicService.createMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 删除歌曲
	removeMusic: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			await ctx.validateField(uuid, "歌曲id不能为空")
			await ctx.contrastField(uuid, "歌曲id错误", () => !isNaN(Number(uuid)))
			const query = await musicService.removeMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 更新歌曲
	updateMusic: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			const { title, singer, url_id, poster_id } = ctx.request.body
			await ctx.validateField(uuid, "歌曲id不能为空")
			await ctx.contrastField(uuid, "歌曲id错误", () => !isNaN(Number(uuid)))
			await ctx.validateField(title, "歌曲名不能为空")
			await ctx.validateField(singer, "歌手不能为空")
			await ctx.validateField(url_id, "歌曲地址不能为空")
			await ctx.validateField(poster_id, "歌曲封面不能为空")
			const query = await musicService.updateMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 获取全部歌曲
	getAllMusic: async (ctx, next) => {
		try {
			const query = await musicService.getAllMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 随机获取一首歌
	getRandomMusic: async (ctx, next) => {
		try {
			const query = await musicService.getRandomMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 获取当前歌曲
	getCurrentMusic: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			await ctx.validateField(uuid, "歌曲id不能为空")
			await ctx.contrastField(uuid, "歌曲id错误", () => !isNaN(Number(uuid)))
			const query = await musicService.getCurrentMusic(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 搜索音乐
	getSearchMusic: async (ctx, next) => {
		try {
			const query = await musicService.getSearchMusic(ctx, next)
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
