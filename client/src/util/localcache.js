/**
 * 缓存工具
 */

import {ErrorNow, LogNow, WarnNow} from "@/util/log"

const PROTOTYPED_CACHE_TYPES = {
	LOCAL: "LOCAL",
	SESSION: "SESSION",
}

const CACHE_TYPE_MAPS = {
	[PROTOTYPED_CACHE_TYPES.LOCAL]: localStorage,
	[PROTOTYPED_CACHE_TYPES.SESSION]: sessionStorage,
}
const NOT_SUPPOR_MSG = "Localcache -> 当前环境不支持"
const SUPPORED_CACHE = Object.values(CACHE_TYPE_MAPS)

class Localcache {
	_version = "0.0.1";

	readCache = null;

	constructor(cacheType) {
		this.envIsSupported()
		this.readCache = CACHE_TYPE_MAPS[cacheType?.toUpperCase()]
		if (!this.readCache) {
			WarnNow(`仅支持 -> ${SUPPORED_CACHE.join(",")}类型的Cache`)
		}
		this.WARN = LogNow(`${cacheType} Warn`)
		this.ERROR = LogNow(`${cacheType} Error`)
	}

	set(k, v) {
		if (!this.isSerialization(v)) {
			WarnNow(`${k} -> 数据类型错误`)
		} else {
			this.readCache.setItem(k, v)
		}
	}

	get(k) {
		return this.readCache.getItem(k)
	}

	delete(k) {
		if (this.get(k) === null) {
			WarnNow(`${k} 不存在或已删除`)
			return false
		}
		return this.readCache.removeItem(k)
	}

	clear() {
		return this.readCache.clear()
	}

	// eslint-disable-next-line class-methods-use-this
	isSerialization(target) {
		if (target === undefined) return false
		if (target instanceof Function) return false
		return typeof target !== "symbol"
	}

	// eslint-disable-next-line class-methods-use-this
	envIsSupported() {
		if (!window || !window.localStorage || !window.sessionStorage) {
			ErrorNow(NOT_SUPPOR_MSG)
		}
	}
}

export const localStore = new Localcache(PROTOTYPED_CACHE_TYPES.LOCAL)
export const sessionStore = new Localcache(PROTOTYPED_CACHE_TYPES.SESSION)
