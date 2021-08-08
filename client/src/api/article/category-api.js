/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method", "url"] }] */
/*
 *      Generic much page project.
 *  FileName:   category-api.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import BaseRequestApi from "@api/api-class/base-request-api"

export class GetCategoryListApi extends BaseRequestApi {
	url() {
		return "/api/auth/article/category/list"
	}
}

export class CreateCategoryApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/category/add"
	}
}

export class RemoveCategoryApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/category/remove"
	}
}

export class UpdateCategoryApi extends BaseRequestApi {
	method() {
		return "POST"
	}

	url() {
		return "/api/permission/article/category/update"
	}
}
