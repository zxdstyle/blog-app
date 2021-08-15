/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   article-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import BaseRequestApi from "@api/api-class/base-request-api"

export class GetArticleListApi extends BaseRequestApi {
	url() {
		return "/api/auth/article/list"
	}
}

export class CreateArticleApi extends BaseRequestApi {
	url() {
		return "/api/permission/article/create"
	}

	method() {
		return "POST"
	}
}

export class RemoveArticleApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/permission/article/remove/${this.uuid}`
	}

	method() {
		return "POST"
	}
}
