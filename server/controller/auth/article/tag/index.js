/*
 *      Generic much page project.
 *  FileName:   index.js
 *  Create On:  2020/11/29 15:50
 *  Create By:  Peachick <wsm_1105@163.com>
 */

const articleService = require("../../../../service/auth/article/tag")

module.exports = {
	// 获取标签列表
	getTagList: async(ctx, next) => {
		try {
			const query = await articleService.getTagList(ctx, next)
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
	// 新建标签
	createTag: async(ctx, next) => {
		try {
			const { title } = ctx.request.body
			if (!title || !title.trim().length) {
				ctx.body = {
					code: 301,
					errorMsg: {
						message: "名称不能为空"
					},
					error: "名称不能为空",
				}
				return
			}
			const query = await articleService.createTag(ctx, next)
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
	// 删除标签
	removeTag: async(ctx, next) => {
		try {
			const query = await articleService.removeTag(ctx, next)
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
	// 编辑标签
	updateTag: async(ctx, next) => {
		try {
			const { title } = ctx.request.body
			if (!title || !title.trim().length) {
				ctx.body = {
					code: 301,
					errorMsg: {
						message: "名称不能为空"
					},
					error: "名称不能为空",
				}
				return
			}
			const query = await articleService.updateTag(ctx, next)
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
