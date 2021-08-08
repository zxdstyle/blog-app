/**
 * 工具
 */

export class validateEmail {
	static test(str) {
		// eslint-disable-next-line max-len
		return /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str)
	}
}

export function getRedirectUrl(name){
	const search = location.search
	if(!search) return "/"
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
	var url = search.substr(1).match(reg)
	return url ? url[2] : "/"
}

export function getAfterActionPage(total, limit, page) {
	return page > 1
		? total - 1 > (page - 1) * limit ? page : page - 1
		: 1
}
