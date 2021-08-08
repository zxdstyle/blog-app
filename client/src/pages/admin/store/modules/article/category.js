/**
 * 分类管理
 */

import {
	GetCategoryListApi,
	CreateCategoryApi,
	RemoveCategoryApi,
	UpdateCategoryApi,
} from "@/api/article/category-api"

const state = {
	categories: [],
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
	setCategoryList(state, payload) {
		state.categories = payload
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
	async fetchCategoryList({ commit, state }, payload = {}) {
		const { filter, limit, page } = payload
		commit("setPage", page)
		commit("setLimit", limit)
		commit("setFilter", filter || {})
		commit("setLoading", true)
		try {
			const api = new GetCategoryListApi()
			api.params = {
				page: state.page,
				limit: state.limit,
				...state.filter,
			}
			const { data, total } = await api.send()
			commit("setLoading", false)
			commit("setCategoryList", data)
			commit("setTotal", total)
		} catch (error) {
			commit("setLoading", false)
			return error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async createCategory({ commit }, payload) {
		try	{
			const api = new CreateCategoryApi()
			api.data = { ...payload }
			const { model } = await api.send()
			return model
		} catch (e) {
			const error = new Error(e.message)
			throw error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async removeCategory({ commit }, payload) {
		try	{
			const api = new RemoveCategoryApi()
			api.data = { ...payload }
			return await api.send()
		} catch (e) {
			const error = new Error(e.message)
			throw error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async updateCategory({ commit }, payload) {
		try	{
			const api = new UpdateCategoryApi()
			api.data = { ...payload }
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
