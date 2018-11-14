import Vue from 'vue'

const state = () => ({
	sharePartyModal: false,
	emailShareModal: false,
	mobileTutorialModal: false,
	emailRegistrationModal: false,
	helpModal: false,
	emailLoginModal: false
})

const mutations = {
	'SET_MODAL_OPEN': (state, payload) => {
		Vue.set(state, payload.prop, payload.value)
	}
}

const actions = {
	setModalOpen ({commit}, payload) {
		commit('SET_MODAL_OPEN', payload)
	}
}

const getters = {
	getModalOpen: state => prop => { return state[prop] }
}

export default {
	state,
	getters,
	mutations,
	actions
}
