/*
 *      Generic much page project.
 *  FileName:   http.js
 *  Create On:  2020/11/30 21:17
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */

import axios from "axios"
import qs from "qs"
import unifyErrorInterceptor from "@config/http/interceptors/unify-error"

export default function createRequest({
	baseURL, responseType, headers,
}) {
	const xhr = axios.create({
		baseURL,
		timeout: 20 * 1000,
		withCredentials: true,
		validateStatus() {
			return true
		},
		responseType,
		headers,
		paramsSerializer: (params) => qs.stringify(params, { indices: false }),
	})

	xhr.interceptors.response.use(
		(response) => {
			const { data } = response
			if (data instanceof Blob) {
				return response
			}

			if (!data.error) {
				return data
			}

			const error = new Error(data.errorMsg.message)
			error.code = data.code
			error.response = response
			throw error
		},
	)

	xhr.interceptors.response.use((response) => response, unifyErrorInterceptor)

	return xhr
}
