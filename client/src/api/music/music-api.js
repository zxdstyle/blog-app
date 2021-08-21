/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   music-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import BaseRequestApi from "@api/api-class/base-request-api"

export class GetMusicListApi extends BaseRequestApi {
	url() {
		return "/api/permission/music/list"
	}
}

export class CreateMusicApi extends BaseRequestApi {
	url() {
		return "/api/permission/music/create"
	}

	method() {
		return "POST"
	}
}

export class RemoveMusicApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/permission/music/remove/${this.uuid}`
	}

	method() {
		return "POST"
	}
}

export class UpdateMusicApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/permission/music/update/${this.uuid}`
	}

	method() {
		return "POST"
	}
}
