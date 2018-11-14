import * as firebase from 'firebase'

const state = () => ({
})

const mutations = {
}

const actions = {
	sendShareEmail ({commit}, payload) {
		console.log(payload)
		return firebase.firestore().collection('email').add({
			to: payload.to,
			subject: payload.subject,
			message: payload.message
		}).then((response) => {
			console.log(response)
			return response
		}).catch((error) => {
			console.log(error)
			return error
		})
	},
	tempSendShareEmail ({commit, getters}, payload) {
		let message = 'This is a temporary solution before sendgrid deliverability improves.'
		message += '\nPlease send these users this message manually'
		message += '\n' + payload.to
		message += '\n\n\n'
		message += '\n' + payload.message
		let link = 'https://partyregistry.co/' + getters.getEvent.id
		return firebase.firestore().collection('email').add({
			to: 'nicholasareias@gmail.com',
			subject: payload.subject,
			message: message,
			link: link
		}).then((response) => {
			console.log(response)
			return response
		}).catch((error) => {
			console.log(error)
			return error
		})
	}
}

const getters = {
}

export default {
	state,
	getters,
	mutations,
	actions
}
