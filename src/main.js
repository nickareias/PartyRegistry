// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import Vuetify from 'vuetify'
import * as firebase from 'firebase'
import SocialSharing from 'vue-social-sharing'

import 'vuetify/dist/vuetify.min.css'
// import './assets/style/main.styl'

import './assets/style/base.scss'

Vue.use(Vuetify, {
	theme: {
		accent: '#FFB067',
		primary: '#56DEF1',
		info: '#6689F3',
		error: '#FF6767'
	}
})

Vue.use(SocialSharing)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	components: { App },
	template: '<App/>',
	created () {
		firebase.initializeApp({
			apiKey: 'AIzaSyDo4U5gsKdYZL04cVhS99XAQt9qZjYeADY',
			authDomain: 'party-registry.firebaseapp.com',
			databaseURL: 'https://party-registry.firebaseio.com',
			projectId: 'party-registry',
			storageBucket: 'party-registry.appspot.com',
			messagingSenderId: '47998683891'
		})

		const firestore = firebase.firestore()
		const settings = {timestampsInSnapshots: true}
		firestore.settings(settings)
	}
})
