import Vue from 'vue'

const state = () => ({
	firstTime: true
})

const mutations = {
	'SET_USER_PROP': (state, payload) => {
		Vue.set(state, payload.prop, payload.value)
	}
}

const actions = {
	setUserProp ({commit}, payload) {
		commit('SET_USER_PROP', payload)
	}
}

const getters = {
	getUserProp: state => prop => { return state[prop] }
}

export default {
	state,
	getters,
	mutations,
	actions
}
