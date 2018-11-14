import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import CreateParty from '@/pages/CreateParty'
import ViewParty from '@/pages/ViewParty'
import Profile from '@/pages/Profile'

import store from '@/store/index'

Vue.use(Router)

let r = new Router({
	base: '/',
	mode: 'history',
	history: true,
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
			children: [
				{
					path: '/profile',
					name: 'Profile',
					component: Profile
				},
				{
					path: '/',
					name: 'CreateParty',
					component: CreateParty
				},
				{
					path: '/:slug',
					name: 'ViewParty',
					component: ViewParty,
					meta: {checkSlug: true}
				}
			]
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})

r.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.checkSlug)) {
		if (store.getters.getEventReference === null) {
			store.dispatch('loadEvent', to.params.slug)
		}
		// let ref = firebase.firestore().collection('events').doc(to.params.slug)
		// console.log(ref)
	}
	next()
})

export default r
