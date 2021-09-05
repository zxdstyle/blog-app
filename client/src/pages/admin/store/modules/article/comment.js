/**
 * 评论管理
 */

import {
	GetCommentsApi,
	RemoveCommentApi,
	CreateCommentApi,
} from "@/api/article/comment-api"

const state = {
	dataSource: [],
	loading: false,
	filter: {
		keyword: "",
	},
	limit: 10,
	page: 1,
	total: 0,
}

const getters = {
	totalPage(state){
		return Math.ceil(state.total / state.limit)
	}
}

const mutations = {
	setLoading(state, payload) {
		state.loading = payload
	},
	setDataSource(state, payload) {
		state.dataSource = payload
	},
	setLimit(state, payload) {
		if (payload) {
			state.limit = payload
		}
	},
	setPage(state, payload) {
		if (payload) {
			state.page = payload
		}
	},
	setTotal(state, payload) {
		state.total = payload
	},
	setFilter(state, payload) {
		Object.keys(payload).forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(state.filter, key)) {
				state.filter[key] = payload[key]
			}
		})
	},
}

const actions = {
	async fetchCommentsList({ commit, state }, payload = {}) {
		const { filter, limit, page, uuid } = payload
		commit("setPage", page)
		commit("setLimit", limit)
		commit("setFilter", filter || {})
		commit("setLoading", true)
		try {
			const api = new GetCommentsApi({ uuid })
			api.params = {
				page: state.page,
				limit: state.limit,
				...state.filter,
			}
			const { data, total } = await api.send()
			commit("setLoading", false)
			commit("setDataSource", data)
			commit("setTotal", total)
		} catch (error) {
			commit("setLoading", false)
			return error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async removeComment({ commit }, payload) {
		try	{
			const { id } = payload
			const api = new RemoveCommentApi({ id })
			return await api.send()
		} catch (e) {
			const error = new Error(e.message)
			throw error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async createComment({ commit }, payload) {
		try	{
			const { uuid, formData } = payload
			const api = new CreateCommentApi({ uuid })
			api.data = formData
			return await api.send()
		} catch (e) {
			const error = new Error(e.message)
			throw error
		}
	},
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}
