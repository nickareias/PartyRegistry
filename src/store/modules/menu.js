const state = () => ({
	menuOpen: false
})

const mutations = {
	'SET_MENU_OPEN': (state, value) => {
		state.menuOpen = value
	}
}

const actions = {
	setMenuOpen ({commit}, value) {
		commit('SET_MENU_OPEN', value)
	}
}

const getters = {
	getMenuOpen: state => { return state.menuOpen }
}

export default {
	state,
	getters,
	mutations,
	actions
}
