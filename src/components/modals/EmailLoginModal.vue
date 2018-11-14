<template>
	<v-dialog :transition="getTransition" :fullscreen="isMobile" scrollable v-model="open" max-width="700px">
		<v-card class="modal-card">
			<div>
				<v-btn @click="open = false" flat class="close-button ma-3"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<v-card-text class="modal-content modal-height">
				<div class="modal-body">
					<h1 class="mb-2">Login and join the party</h1>
					<p class="red--text">{{getLoginError}}</p>
					<v-form v-model="valid">
						<v-text-field 
							name="email"
							label="Email"
							v-model="email"
							type="email"
							:rules="emailRules"
							@keyup.enter="onLogin"
						>
						</v-text-field>
						<v-text-field 
							name="password"
							label="Password"
							v-model="password"
							type="password"
							:rules="passwordRules"
							@keyup.enter="onLogin"
						>
						</v-text-field>
					</v-form>
					<div class="full-width-row--centered">
						<v-btn flat class="submit-button accent" :loading="loading" @click="onLogin">Login</v-btn>
					</div>
				</div>
				<div class="modal-footer">
					<img height="60px" width="60px" src="@/assets/baloons-brighter.png">
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
	data () {
		return {
			email: null,
			password: null,
			confirmPassword: null,
			loading: false,
			valid: false,
			emailRules: [
				v => !!v || 'E-mail is required'
			],
			passwordRules: [
				v => !!v || 'Password is required'
			]
		}
	},
	methods: {
		...mapActions(['setModalOpen', 'emailRegistration', 'emailLogin', 'setSnackbarText', 'setMenuOpen']),
		onLogin () {
			this.loading = true
			this.emailLogin({email: this.email, password: this.password}).then((response) => {
				this.loading = false
				if (response) {
					this.open = false
					this.setMenuOpen(false)
					if (response.user) {
						if (response.user.displayName) {
							this.setSnackbarText('Welcome back, ' + response.user.displayName)
						} else {
							this.setSnackbarText('Welcome back')
						}
					} else {
						this.setSnackbarText('Welcome back')
					}
				}
			}).catch((error) => {
				console.log(error)
			})
		}
	},
	computed: {
		...mapGetters(['getModalOpen', 'getLoginError', 'getUsername']),
		open: {
			get () {
				return this.getModalOpen('emailLoginModal')
			},
			set (value) {
				if (value === false) {
					this.email = ''
					this.password = ''
				}
				this.setModalOpen({prop: 'emailLoginModal', value: value})
			}
		},
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'xs') {
				return true
			}
		},
		translatedErrorMessage () {
			if (this.error === 'The password is invalid or the user does not have a password.') {
				return 'Invalid password'
			} if (this.error === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
				return 'Invalid username'
			} else {
				return this.error
			}
		},
		getTransition () {
			if (this.isMobile) {
				return 'dialog-bottom-transition'
			} else {
				return 'dialog-transition'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-footer {
	padding: 7px 0 20px 0;
	width: 100%;
	text-align: center;
}
.modal-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 48px;
	h1 {
		margin-bottom: 5px;
		text-decoration: underline;
		font-size: 2.0em;
		color: #4A4A4A;
	}

	p {
		font-size: 1.1em;
		color: #666;
	}
}
@media screen and (max-width: 600px) and (max-height: 499px) {
	.modal-content {
		padding: 0 24px;
	}
}
@media screen and (max-width: 600px) and (min-height: 500px) {
	.modal-content {
		padding: 0 24px;
	}
	.modal-body {
		margin-top: 5vh;
	}
	.login-button {
		margin-top: 3vh;
	}
	.modal-footer {
		margin-bottom: 5vh;
	}
}
</style>
