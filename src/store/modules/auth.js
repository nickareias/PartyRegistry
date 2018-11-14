import * as firebase from 'firebase'
import Vue from 'vue'

const state = () => ({
	user: null,
	user_reference: null,
	registration_error_message: '',
	login_error_message: '',
	user_events: null
})

const mutations = {
	'SET_USER': (state, payload) => {
		let authUser = {
			displayName: payload.displayName,
			email: payload.email,
			emailVerified: payload.emailVerified,
			photoURL: payload.photoURL,
			isAnonymous: payload.isAnonymous,
			uid: payload.uid,
			providerData: payload.providerData
		}

		state.user = authUser
	},
	'SET_USERNAME': (state, value) => {
		Vue.set(state.user, 'displayName', value)
		firebase.auth().currentUser.updateProfile({displayName: value})
	},
	'SET_USER_REFERENCE': (state, payload) => {
		state.user_reference = payload
	},
	'CLEAR_USER': (state, payload) => {
		state.user = null
	},
	'SET_AUTH_ERROR': (state, payload) => {
		state[payload.prop] = payload.value
	},
	'SET_USER_EVENTS': (state, payload) => {
		state.user_events = payload
	}
}

const actions = {
	fetchUserEvents ({commit, getters, state}) {
		console.log('fetching user events:', state.user.uid)
		let eventRef = firebase.firestore().collection('events')
		let query = eventRef.where('owner', '==', state.user.uid)

		query.get().then((doc) => {
			if (!doc.empty) {
				let list = []
				for (var i = 0; i < doc.docs.length; i++) {
					list.push({...doc.docs[i].data(), id: doc.docs[i].id})
				}
				commit('SET_USER_EVENTS', list)
			} else {
				console.log('No events')
			}
		}).catch((error) => {
			console.log(error)
		})
	},
	setAuthError ({commit, state}, payload) {
		commit('SET_AUTH_ERROR', payload)
	},
	setUsername ({commit, state}, payload) {
		commit('SET_USERNAME', payload.displayName)
		let email = 'no@email.com'
		if (payload.email) {
			email = payload.email
		}
		firebase.firestore().collection('users').doc(state.user.uid).set({
			name: payload.displayName,
			email: email
		})
	},
	checkLogin ({commit, dispatch}, payload) {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				commit('SET_USER', user)
				let message = user.isAnonymous ? 'Not signed in' : 'Signed in'
				console.log(message, user)
				dispatch('fetchUserEvents')
			} else {
				console.log('not signed in')
				firebase.auth().signInAnonymously()
					.then((result) => {
					})
					.catch((error) => {
						console.log(error)
					})
			}
		})
	},
	emailRegistration ({commit, dispatch}, payload) {
		var credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
		return firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then((usercred) => {
			console.log('Anonymous account successfully upgraded', usercred)
			let user = Object.assign({}, usercred.user)
			if (payload.displayName !== '' && payload.displayName !== null) {
				user.displayName = payload.displayName
				dispatch('setUsername', payload)
			}
			commit('SET_USER', user)
			return true
		}, (error) => {
			console.log('Error upgrading anonymous account', error)
			commit('SET_AUTH_ERROR', {prop: 'registration_error_message', value: error.message})
			return false
		})
	},
	emailLogin ({commit}, payload) {
		let prevUser = firebase.auth().currentUser
		return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
			.then(() => {
				return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
					.then((response) => {
						console.log('emaillogin response', response)
						// delete temporary anonmous user after signing in
						// check to see if this anonymous user had created any parties first
						// this way we can link their data to their account.
						// could be an issueif someone is using multiple devices before logging in
						if (prevUser.isAnonymous) {
							prevUser.delete()
						}
						return response
					})
					.catch((error) => {
						console.log(error)
						commit('SET_AUTH_ERROR', {prop: 'login_error_message', value: 'Invalid username or password'})
						return false
					})
			})
			.catch((error) => {
				console.log(error)
			})
	},
	updateUser ({commit}, payload) {
		commit('SET_USER', payload)
	},
	signOut ({commit}) {
		return firebase.auth().signOut().then(() => {
			commit('CLEAR_USER')
		}).catch((error) => {
			console.log(error)
		})
	}
}

const getters = {
	user: state => { return state.user },
	getUsername: state => {
		if (state.user) {
			return state.user.displayName
		} else {
			return null
		}
	},
	getRegistrationError: state => {
		return state.registration_error_message
	},
	getLoginError: state => {
		return state.login_error_message
	},
	getUserEvents: state => {
		return state.user_events
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
