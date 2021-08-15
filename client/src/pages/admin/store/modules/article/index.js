/**
 * 文章
 */

import {
	GetArticleListApi,
	CreateArticleApi,
	RemoveArticleApi,
} from "@/api/article/article-api"
import tag from "./tag"
import category from "./category"

const state = {
	articleList: [],
	loading: false,
	filter: {
		keyword: "",
		publish: "",
		category: "",
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
	setArticleList(state, payload) {
		state.articleList = payload
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
	async fetchArticleList({ commit, state }, payload = {}) {
		const { filter, limit, page } = payload
		commit("setPage", page)
		commit("setLimit", limit)
		commit("setFilter", filter || {})
		commit("setLoading", true)
		try {
			const api = new GetArticleListApi()
			api.params = {
				page: state.page,
				limit: state.limit,
				...state.filter,
			}
			const { data, total } = await api.send()
			commit("setLoading", false)
			commit("setArticleList", data)
			commit("setTotal", total)
		} catch (error) {
			commit("setLoading", false)
			return error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async createArticle({ commit }, payload) {
		const api = new CreateArticleApi()
		api.data = payload
		return await api.send()
	},
	// eslint-disable-next-line no-unused-vars
	async removeArticle({ commit }, payload) {
		const api = new RemoveArticleApi({ uuid: payload.uuid })
		return await api.send()
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
	modules: {
		tag,
		category,
	},
}
