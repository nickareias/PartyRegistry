<template>
	<v-app>
		<v-toolbar
			flat
			absolute
			class="toolbar"
		>
			<v-btn @click.stop="goHome" flat class="toolbar-title-button hidden-sm-and-down">
				<img height="30px" width="30px" class="mr-3" src="@/assets/baloons-brighter.png">
				<h1>Party Registry</h1>
			</v-btn>
			<div class="hidden-md-and-up">
				<v-btn @click.stop="goHome" flat class="toolbar-title-button hidden-sm-only ml-0" style="min-width: 0px!important width: 50px; height: 60px;">
					<img height="40px" width="40px" class="mt-0" src="@/assets/baloons.png">
				</v-btn>
				<v-btn flat class="toolbar-title-button hidden-xs-only" style="margin-top: 15px;">
					<img height="30px" width="30px" class="mr-3" src="@/assets/baloons.png">
					<h1>Party Registry</h1>
				</v-btn>
			</div>
			<v-spacer></v-spacer>
			<v-btn @click="menuOpen = !menuOpen" flat class="toolbar-menu-button hidden-sm-and-down mr-3">
				<h1>menu</h1>
			</v-btn>
			<div class="hidden-md-and-up mr-0">
				<v-btn @click="menuOpen = !menuOpen" flat large icon class="toolbar-menu-button-mobile hidden-xs-only mr-4 mt-4">
					<i class="fa fa-bars" style="font-size: 1.5em;"></i>
				</v-btn>
				<v-btn @click="menuOpen = !menuOpen" flat large icon class="toolbar-menu-button-mobile hidden-sm-only mr-4">
					<i class="fa fa-bars" style="font-size: 1.5em;"></i>
				</v-btn>
			</div>
		</v-toolbar>
		<v-content>
			<router-view/>
		</v-content>
		<v-footer fixed class="footer mb-0" v-if="!isMobile">
			<v-spacer></v-spacer>
			<v-btn style="width: 50px; min-width: 50px;" @click="goToTwitter" flat class="footer-twiter-button">
				<!-- <h1>twitter</h1> -->
				<i style="color: white; font-size: 1.65em;" class="far fa-at"></i>
			</v-btn>
		</v-footer>
		<v-navigation-drawer right v-model="menuOpen" disable-resize-watcher app temporary>
			<div class="nav-drawer-container">
				<div class="close-button-container">
					<v-btn flat @click="menuOpen = !menuOpen" class="close-button mr-3 mt-3"><i style="font-size: 2.0em; color: #888;" class="fal fa-times"></i></v-btn>
				</div>
				<v-btn flat class="nav-drawer-button" @click="openProfile"><p>Saved Checklists</p></v-btn>
				<v-btn flat class="nav-drawer-button" v-if="user === null || user.isAnonymous === true" @click="setModalOpen({prop: 'emailLoginModal', value: true})"><p>Sign in</p></v-btn>
				<v-btn flat class="nav-drawer-button" v-if="user === null || user.isAnonymous === true" @click="setModalOpen({prop: 'emailRegistrationModal', value: true})"><p>Register</p></v-btn>
				<v-btn flat class="nav-drawer-button" v-else @click="signOut"><p>Sign out</p></v-btn>
				<v-btn flat class="nav-drawer-button" @click="openHelp"><p>Help</p></v-btn>
				<!-- <v-btn flat class="nav-drawer-button" @click="testSnackbar"><p>Test Snackbar</p></v-btn> -->
			</div>
		</v-navigation-drawer>
		<!-- Modals -->
		<share-party-modal></share-party-modal>
		<email-share-modal></email-share-modal>
		<help-modal></help-modal>
		<mobile-tutorial-modal></mobile-tutorial-modal>
		<email-registration-modal></email-registration-modal>
		<email-login-modal></email-login-modal>
		<snackbar></snackbar>
	</v-app>
</template>

<script>
import HelpModal from '@/components/modals/HelpModal.vue'
import MobileTutorialModal from '@/components/modals/MobileTutorialModal.vue'
import SharePartyModal from '@/components/modals/SharePartyModal.vue'
import EmailRegistrationModal from '@/components/modals/EmailRegistrationModal.vue'
import EmailLoginModal from '@/components/modals/EmailLoginModal.vue'
import EmailShareModal from '@/components/modals/EmailShareModal.vue'
import Snackbar from '@/components/Snackbar.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
	components: {
		HelpModal,
		EmailShareModal,
		EmailRegistrationModal,
		EmailLoginModal,
		SharePartyModal,
		MobileTutorialModal,
		Snackbar
	},
	mounted () {
		this.checkLogin()
	},
	data () {
		return {
			title: 'Party Registry'
		}
	},
	methods: {
		...mapActions(['setModalOpen', 'signOut', 'updateUser', 'checkLogin', 'setSnackbarText', 'setMenuOpen']),
		goToTwitter () {
			window.open('https://twitter.com/nickareias', '_blank')
		},
		goHome () {
			console.log('go home')
			this.$router.push('/')
		},
		openHelp () {
			this.setModalOpen({prop: 'helpModal', value: true})
		},
		testSnackbar () {
			this.setSnackbarText('Testing')
		},
		openProfile () {
			this.$router.push({name: 'Profile'})
		}
	},
	computed: {
		...mapGetters(['getModalOpen', 'user', 'getMenuOpen']),
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
				return true
			}
		},
		menuOpen: {
			get () {
				return this.getMenuOpen
			},
			set (value) {
				this.setMenuOpen(value)
			}
		}
	},
	name: 'App'
}
</script>

<style lang="stylus">
  @require '../node_modules/vuetify/src/stylus/settings/_colors.styl'
  $theme := {
    primary: #009688
    accent: #FFC107
    secondary: #00796B
    info: #B2DFDB
    warning: $red.base
    error: #AAA
    success: $green.base
  }
  $body-font-family := 'Roboto', san-serif
  @require '../node_modules/vuetify/src/stylus/main.styl'
</style>

<style lang="scss">
.nav-drawer-button {
	p {
		margin: 0;
		text-transform: capitalize;
		font-size: 1.15em;
		font-family: 'Inconsolata', monospace;
		text-decoration: underline;
	}
}
.nav-drawer-container {
	.close-button-container {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}
	display: flex;
	flex-direction: column;
	align-items: right;
}
.toolbar {
	background-color: transparent!important;

	.toolbar-title-button {
		background-color: transparent!important;
		h1 {
			font-size: 1.5em!important;
			color: #555!important;
			text-transform: capitalize!important;
		}
	}

	.toolbar-menu-button {
		background-color: transparent!important;
		h1 {
			font-size: 1.5em!important;
			color: #FFF!important;
			text-transform: lowercase!important;
		}
	}

	.toolbar-menu-button-mobile {
		background-color: transparent!important;
		color: #666!important;
	}
}

.twitter-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 100px!important;
	max-width: 100px!important;
	h1 {
		font-size: 1.5em!important;
		color: #FFF!important;
		text-transform: lowercase!important;
		margin-bottom: 0px;
	}
}

.footer {
	pointer-events: none;
	background-color: transparent!important;
	min-height: 45px!important;
	height: 61px!important;
	padding-right: 6px;
	.footer-twiter-button {
		pointer-events: auto;
		background-color: transparent!important;
		h1 {
			font-size: 1.5em!important;
			color: #FFF!important;
			text-transform: lowercase!important;
			margin-bottom: 0px;
		}
	}
}

@media screen and (max-width: 600px) {
	.toolbar {
		padding-top: 10px;
	}
	.toolbar-title-button {
		width: 70px!important;
		min-width: 70px!important;
		margin-left: 10px!important;
	}
}
</style>
