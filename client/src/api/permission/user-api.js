/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
import BaseRequestApi from "@api/api-class/base-request-api"

/**
 * 获取用户登录信息
 */
export class GetUserInfoApi extends BaseRequestApi {
	url() {
		return "/api/permission/user"
	}
}
