const MD5 = require("crypto-js/md5")
const jwt = require("jsonwebtoken")

module.exports = {
	// 获取用户信息
	getUser: async (ctx, next) => {
		try {
			console.log(222)
			const token = ctx.cookies.get(ctx.config.USER_TOKEN_COOKIE_NAME)
			const tokenData = jwt.verify(token, ctx.config.SECRET)
			const userId = tokenData.id
			const { results } = await ctx.db(`
				select u.id, u.uuid, u.level, u.email, u.username,
				r.filename avatar, u.age, u.sex, u.createTime, u.lastTime from user u
				left join resource r on u.avatar_id=r.id where u.id=${userId}
			`)
			const data = Object.assign({}, results[0])
			delete data.password
			console.log(data)
		} catch (err) {
			console.log(err)
		}
	},
}
