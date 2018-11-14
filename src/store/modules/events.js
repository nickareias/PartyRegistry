import Vue from 'vue'
import * as firebase from 'firebase'
import moment from 'moment'

const state = () => ({
	event_reference: null,
	event_owner_name: null,
	event: null,
	items: []
})

const mutations = {
	'SET_ITEMS': (state, payload) => {
		Vue.set(state, 'items', payload)
	},
	'SET_EVENT': (state, payload) => {
		payload.onSnapshot((doc) => {
			console.log('Current data: ', doc.data())
			state.event = {...doc.data(), id: doc.id}
		})
		state.event_reference = payload
	},
	'SET_EVENT_OWNER': (state, payload) => {
		payload.onSnapshot((doc) => {
			console.log('Current event owner data: ', doc.data())
			if (doc.data()) {
				if (doc.data().name) {
					state.event_owner_name = doc.data().name
				}
			}
		})
	},
	'CLEAR_EVENT': (state) => {
		state.event_reference = null
		state.event = null
		state.event_owner_name = null
	}
}

const actions = {
	clearEvent ({commit}) {
		commit('CLEAR_EVENT')
	},
	loadEvent ({commit, dispatch, state}, value) {
		setTimeout(() => {
			dispatch('setEventReference', value)
		}, 1)
	},
	saveEvent ({commit, dispatch}, payload) {
		return firebase.firestore().collection('events').add({
			owner: payload.user,
			items: payload.items,
			title: null,
			created: moment().format(),
			updated: moment().format()
		}).then((response) => {
			console.log(response)
			dispatch('setEventReference', response.id)
			// commit('SET_EVENT', response)
			return response
		}).catch((error) => {
			return error
		})
	},
	updateEvent ({state}, payload) {
		if (state.event_reference) {
			return state.event_reference.update({...payload, 'updated': moment().format()}).then((response) => {
				return response
			}).catch((error) => {
				return error
			})
		}
	},
	setEventReference ({commit, dispatch}, value) {
		console.log('setting event reference')
		let reference = firebase.firestore().collection('events').doc(value)
		if (reference) {
			commit('SET_EVENT', reference)
			dispatch('setEventOwnerName')
		}
	},
	setItems ({commit}, payload) {
		commit('SET_ITEMS', payload)
	},
	setEventOwnerName ({commit, state}) {
		if (state.event_reference !== null) {
			state.event_reference.get().then((doc) => {
				let ref = firebase.firestore().collection('users').doc(doc.data().owner)
				if (ref) {
					commit('SET_EVENT_OWNER', ref)
				}
			})
		}
	}
}

const getters = {
	getItems: state => {
		if (state.event === null) {
			return state.items
		} else {
			return state.event.items
		}
	},
	getLocalItems: state => {
		return state.items
	},
	getEventOwnerName: state => {
		return state.event_owner_name
	},
	getEventTitle: state => {
		if (state.event) {
			return state.event.title
		} else {
			return null
		}
	},
	getEvent: state => {
		return state.event
	},
	getEventReference: state => {
		return state.event_reference
	},
	getShareUrl: state => {
		if (state.event) {
			return 'https://partyregistry.co/' + state.event.id
		} else {
			return ''
		}
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
