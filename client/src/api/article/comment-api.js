/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   comment-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import BaseRequestApi from "@api/api-class/base-request-api"

export class GetCommentsApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/auth/article/comments/${this.uuid}`
	}
}

export class RemoveCommentApi extends BaseRequestApi {
	constructor({ id }) {
		super(id)
		this.id = id
	}

	method() {
		return "POST"
	}

	url() {
		return `/api/permission/article/comments/${this.id}/remove`
	}

}

export class CreateCommentApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	method() {
		return "POST"
	}

	url() {
		return `/api/auth/article/comments/reply/${this.uuid}`
	}

}

