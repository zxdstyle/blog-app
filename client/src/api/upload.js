/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   music-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import UploadRequestApi from "@api/api-class/upload-request-api"
import BaseRequestApi from "@api/api-class/base-request-api"

export class UploadFileApi extends UploadRequestApi {
	url() {
		return "/api/permission/public/upload"
	}
}

export class RemoveFileApi extends BaseRequestApi {
	constructor({ uuid }) {
		super(uuid)
		this.uuid = uuid
	}

	url() {
		return `/api/permission/public/remove-file/${this.uuid}`
	}

	method() {
		return "POST"
	}
}
