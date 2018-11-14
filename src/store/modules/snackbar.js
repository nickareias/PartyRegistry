const state = () => ({
	snackbarText: '',
	showSnackbar: false
})

const mutations = {
	'SET_SNACKBAR_OPEN': (state, value) => {
		state.showSnackbar = value
	},
	'SET_SNACKBAR_TEXT': (state, value) => {
		state.snackbarText = value
	}
}

const actions = {
	setSnackbarOpen ({commit}, value) {
		commit('SET_SNACKBAR_OPEN', value)
	},
	setSnackbarText ({commit}, value) {
		commit('SET_SNACKBAR_OPEN', true)
		commit('SET_SNACKBAR_TEXT', value)
	}
}

const getters = {
	getSnackbarOpen: state => { return state.showSnackbar },
	getSnackbarText: state => { return state.snackbarText }
}

export default {
	state,
	getters,
	mutations,
	actions
}
