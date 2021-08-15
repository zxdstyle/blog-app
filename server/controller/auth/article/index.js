/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 */

const articleService = require("../../../service/auth/article")

module.exports = {
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
			const { title, content, category, tags } = ctx.request.body
			await ctx.validateField(title, "标题不能为空")
			await ctx.validateField(content, "文章内容不能为空")
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
}
