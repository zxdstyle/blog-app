import {
	GetClientArticleListApi,
} from "@api/article/article-api"

const state = {
	articleList: [],
	loadArticles: false,
}

const getters = {}

const mutations = {
	setArticleList(state, payload) {
		state.articleList = [...state.articleList, ...payload]
	},
	setLoadArticles(state, payload) {
		state.loadArticles = payload
	},
}

const actions = {
	async fetchArticleList({ commit }, payload) {
		try {
			commit("setLoadArticles", true)
			const api = new GetClientArticleListApi()
			const { data } = await api.send()
			commit("setArticleList", data)
			commit("setLoadArticles", false)
		} catch (err) {
			return err
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
