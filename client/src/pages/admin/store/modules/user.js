/**
 * user
 */

import {
	GetUserInfoApi,
} from "@/api/permission/user-api"

const state = {
	userInfo: null,
	loading: false,
	hasLogin: false,
	failAuth: false,
}

const getters = {}

const mutations = {
	setUserInfo(state, payload) {
		state.userInfo = payload
	},
	setLogin(state, payload) {
		state.hasLogin = payload
	},
	setLoading(state, payload) {
		state.loading = payload
	},
	setFailAuth(state, payload) {
		state.failAuth = payload
	},
}

const actions = {
	async fetchUserInfo({ commit }) {
		commit("setLoading", true)
		try {
			const api = new GetUserInfoApi()
			const { model } = await api.send()
			console.log(model)
			commit("setLoading", false)
			commit("setLogin", true)
			commit("setUserInfo", model)
		} catch (error) {
			commit("setFailAuth", true)
			return error
		}
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}
