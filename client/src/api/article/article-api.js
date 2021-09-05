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
		return "/api/permission/article/list"
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

export class GetArticleDetail extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/permission/article/detail/${this.uuid}`
	}
}

export class ToggleArticleTopApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	method() {
		return "POST"
	}

	url() {
		return `/api/permission/article/toggletop/${this.uuid}`
	}
}

export class UpdateArticleApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	method() {
		return "POST"
	}

	url() {
		return `/api/permission/article/update/${this.uuid}`
	}
}

// 前台
export class GetClientArticleListApi extends BaseRequestApi {
	url() {
		return "/api/auth/article/list"
	}
}
