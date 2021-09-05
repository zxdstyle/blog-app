/**
 * 文章
 */

import {
	GetArticleListApi,
	CreateArticleApi,
	RemoveArticleApi,
	GetArticleDetail,
	ToggleArticleTopApi,
	UpdateArticleApi,
} from "@/api/article/article-api"
import tag from "./tag"
import category from "./category"
import comment from "./comment"

const state = {
	articleList: [],
	loading: false,
	loadingDetail: false,
	filter: {
		keyword: "",
		publish: "",
		category: "",
		is_link: "",
		is_original: "",
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
	setLoadingDetail(state, payload) {
		state.loadingDetail = payload
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
	async updateArticle({ commit }, payload) {
		const { uuid, formData } = payload
		const api = new UpdateArticleApi({ uuid })
		api.data = formData
		return await api.send()
	},
	// eslint-disable-next-line no-unused-vars
	async getArticleDetail({ commit }, payload) {
		try {
			commit("setLoadingDetail", true)
			const { uuid } = payload
			const api = new GetArticleDetail({ uuid })
			return await api.send()
		} finally {
			commit("setLoadingDetail", false)
		}
	},
	// eslint-disable-next-line no-unused-vars
	async removeArticle({ commit }, payload) {
		const api = new RemoveArticleApi({ uuid: payload.uuid })
		return await api.send()
	},
	// eslint-disable-next-line no-unused-vars
	async toggleTopArticle({ commit }, payload) {
		const { uuid, params } = payload
		const api = new ToggleArticleTopApi({ uuid })
		api.data = params
		return await api.send()
	},
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
		comment,
	},
}
