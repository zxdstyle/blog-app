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
}
