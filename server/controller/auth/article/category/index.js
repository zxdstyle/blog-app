/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 */

const articleService = require("../../../../service/auth/article/category")

module.exports = {
	// 获取分类列表
	getCategoryList: async(ctx, next) => {
		try {
			const query = await articleService.getCategoryList(ctx, next)
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
	// 新建分类
	createCategory: async(ctx, next) => {
		try {
			const { title } = ctx.request.body
			await ctx.validateField(title, "名称不能为空")
			const query = await articleService.createCategory(ctx, next)
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
	// 删除分类
	removeCategory: async(ctx, next) => {
		try {
			const query = await articleService.removeCategory(ctx, next)
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
	// 编辑分类
	updateCategory: async(ctx, next) => {
		try {
			const { title } = ctx.request.body
			await ctx.validateField(title, "名称不能为空")
			const query = await articleService.updateCategory(ctx, next)
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
}
