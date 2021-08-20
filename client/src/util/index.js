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

export const getFileExt = (fileName) => {
	const extReg = /(\.[^.]+)$/
	extReg.test(fileName)
	const ext = `${RegExp.$1}`
	extReg.lastIndex = 0
	return ext.toString().toLowerCase()
}

export function isCorrectType(supportedType, targetType) {
	if (Array.isArray(supportedType)) {
		return supportedType.filter((type) => type.toLowerCase() === targetType.toLowerCase()).length > 0
	}
	return supportedType.toLowerCase() === targetType.toLowerCase()
}
