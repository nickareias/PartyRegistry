import Vue from 'vue'
import Vuex from 'vuex'

import Events from './modules/events'
import Modals from './modules/modals'
import User from './modules/user'
import Auth from './modules/auth'
import Snackbar from './modules/snackbar'
import Menu from './modules/menu'
import Email from './modules/email'

Vue.use(Vuex)

const createStore = new Vuex.Store({
	modules: {
		Events,
		Modals,
		User,
		Auth,
		Snackbar,
		Menu,
		Email
	},
	strict: false
})

export default createStore
