/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   tag-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import BaseRequestApi from "@api/api-class/base-request-api"

export class GetTagListApi extends BaseRequestApi {
	url() {
		return "/api/auth/article/tag/list"
	}
}

export class CreateTagApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/tag/add"
	}
}

export class RemoveTagApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/tag/remove"
	}
}

export class UpdateTagApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/tag/update"
	}
}
