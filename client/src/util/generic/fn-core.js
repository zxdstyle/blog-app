/**
 * 通用的函数
 */

/**
 * 柯理化
 * @param fn: {Function}
 * @return {(function(...[*]=): (function(...[*]=): *|undefined))|*}
 */
export function curry(fn) {
	return function curried(...args) {
		if (args.length >= fn.length) {
			fn.apply(this, args)
		} else {
			return function (...args2) {
				return curried.apply(this, args.concat(args2))
			}
		}
	}
}
/**
 * 防抖
 * @param func: {Function}
 * @param wait: {Number}
 * @param arg1: {*}
 * @return {(function(...[*]): void)|*}
 */
let timer
export function debounce(func, wait = 500, ...arg1) {
	return function (...args) {
		const ctx = this
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.call(ctx, ...arg1, ...args)
		}, wait)
	}
}
