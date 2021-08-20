/* eslint class-methods-use-this: ["error", { "exceptMethods": ["method"] }] */
import BaseRequestApi from "./base-request-api"


class UploadRequestApi extends BaseRequestApi {
	constructor(args) {
		super({
			...args,
			headers: { "Content-Type": "multipart/form-data" },
		})
	}

	method() {
		return "POST"
	}
}

export default UploadRequestApi
