/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 */

const articleService = require("../../../service/auth/article")

module.exports = {
	// 删除评论
	removeComment: async(ctx, next) => {
		try {
			const { id } = ctx.request.params
			await ctx.validateField(id, "参数不能为空")
			const query = await articleService.removeComment(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 回复评论
	replyComment: async(ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			const { username, content, email, target_name } = ctx.request.body
			await ctx.validateField(uuid, "文章不能为空")
			await ctx.validateField(username, "用户名不能为空")
			await ctx.validateField(content, "评论不能为空")
			await ctx.validateField(email, "邮箱不能为空")
			const query = await articleService.replyComment(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 获取文章评论
	getArticleComments: async(ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			await ctx.validateField(uuid, "参数不能为空")
			const query = await articleService.getArticleComments(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 前台获取文章列表
	getClientArticleList: async(ctx, next) => {
		try {
			const query = await articleService.getClientArticleList(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			console.log(error)
			ctx.body = {
				...error,
			}
		}
	},
	// 获取文章列表
	getArticleList: async(ctx, next) => {
		try {
			const query = await articleService.getArticleList(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			console.log(error)
			ctx.body = {
				...error,
			}
		}
	},
	// 创建文章
	createArticle: async (ctx, next) => {
		try {
			const { title, content, category, tags, is_link } = ctx.request.body
			await ctx.validateField(title, "标题不能为空")
			if (is_link < 1) {
				await ctx.validateField(content, "文章内容不能为空")
			}
			await ctx.validateField(category, "请选择文章分类")
			await ctx.validateField(tags, "请选择文章标签")
			const query = await articleService.createArticle(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 删除文章
	removeArticle: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			await ctx.validateField(uuid, "参数不能为空")
			const query = await articleService.removeArticle(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 更新文章
	updateArticle: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			const { title, content, category, tags, is_link } = ctx.request.body
			await ctx.validateField(uuid, "参数不能为空")
			await ctx.validateField(title, "标题不能为空")
			if (is_link < 1) {
				await ctx.validateField(content, "文章内容不能为空")
			}
			await ctx.validateField(category, "请选择文章分类")
			await ctx.validateField(tags, "请选择文章标签")
			const query = await articleService.updateArticle(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 获取文章详情
	getArticleDetail: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			await ctx.validateField(uuid, "参数不能为空")
			const query = await articleService.getArticleDetail(ctx, next)
			ctx.body = {
				...query,
			}
		} catch (error) {
			ctx.body = {
				...error,
			}
		}
	},
	// 切换置顶
	toggleTop: async (ctx, next) => {
		try {
			const { uuid } = ctx.request.params
			const { top } = ctx.request.body
			await ctx.validateField(uuid, "文章不能为空")
			await ctx.contrastField([top], "参数不能为空", (top) => top !== undefined)
			const query = await articleService.toggleTop(ctx, next)
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
