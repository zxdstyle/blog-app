/**
 * 日志
 */

import { curry } from "@/util/generic/fn-core"
import DateFormat from "@/util/generic/date"

const LOG_LEVELS_MAP = {
	WARN: "warn",
	ERROR: "error",
	INFO: "log",
	DEBUG: "log",
}
const LOG_LEVEL_KEYS = Object.keys(LOG_LEVELS_MAP)

function Log(date, level, msg) {
	const userLevel = LOG_LEVEL_KEYS.filter((l) => l.toLowerCase() === level?.toLowerCase()).join("")
	const logType = LOG_LEVELS_MAP[userLevel] || LOG_LEVELS_MAP.DEBUG
	console[logType](`[${DateFormat("MM-dd HH:mm")}(${level.toUpperCase()})]`, msg)
}

export const LogNow = curry(Log)(new Date())
export const DebugNow = LogNow("DEBUG")
export const ErrorNow = LogNow(LOG_LEVELS_MAP.ERROR)
export const WarnNow = LogNow(LOG_LEVELS_MAP.WARN)
export default curry(Log)
