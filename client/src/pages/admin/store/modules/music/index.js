/**
 * 歌曲
 */

import {
	GetMusicListApi,
	CreateMusicApi,
	RemoveMusicApi,
	UpdateMusicApi,
} from "@api/music/music-api"

const state = {
	musicList: [],
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
	setMusicList(state, payload) {
		state.musicList = payload
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
	async fetchMusicList({ commit, state }, payload = {}) {
		const { filter, limit, page } = payload
		commit("setPage", page)
		commit("setLimit", limit)
		commit("setFilter", filter || {})
		commit("setLoading", true)
		try {
			const api = new GetMusicListApi()
			api.params = {
				page: state.page,
				limit: state.limit,
				...state.filter,
			}
			const { data, total } = await api.send()
			commit("setLoading", false)
			commit("setMusicList", data)
			commit("setTotal", total)
		} catch (error) {
			commit("setLoading", false)
			return error
		}
	},
	// eslint-disable-next-line no-unused-vars
	async createMusic({ commit }, payload) {
		try {
			const api = new CreateMusicApi()
			api.data = payload
			return await api.send()
		} catch (err) {
			return err
		}
	},
	// eslint-disable-next-line no-unused-vars
	async removeMusic({ commit }, payload) {
		try {
			const { uuid } = payload
			const api = new RemoveMusicApi({ uuid })
			return await api.send()
		} catch (err) {
			return err
		}
	},
	// eslint-disable-next-line no-unused-vars
	async updateMusic({ commit }, payload) {
		try {
			const { uuid, formData } = payload
			const api = new UpdateMusicApi({ uuid })
			api.data = formData
			return await api.send()
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
