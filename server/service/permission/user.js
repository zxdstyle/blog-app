const MD5 = require("crypto-js/md5")
const jwt = require("jsonwebtoken")

module.exports = {
	// 获取用户信息
	getUser: async (ctx, next) => {
		try {
			let queryMsg = {}
			const token = ctx.cookies.get(ctx.config.USER_TOKEN_COOKIE_NAME)
			const tokenData = jwt.verify(token, ctx.config.SECRET)
			const userId = tokenData.id
			const { results } = await ctx.db(`
				select u.id, u.uuid, u.level, u.email, u.username,
				r.filename avatar, u.age, u.sex, u.createTime, u.lastTime from user u
				left join resource r on u.avatar_id=r.id where u.id=${userId}
			`)
			const model = Object.assign({}, results[0])
			delete model.password
			return queryMsg = {
				model,
			}
		} catch (err) {
			console.log(err)
			return {
				code: 500,
				errorMsg: {
					message: err.message,
				},
				error: err,
			}
		}
	},
}
