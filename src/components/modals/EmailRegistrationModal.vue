<template>
	<v-dialog :transition="getTransition" :fullscreen="isMobile" scrollable v-model="open" max-width="700px">
		<v-card class="modal-card">
			<div>
				<v-btn @click="open = false" flat class="close-button ma-3"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<v-card-text class="modal-content modal-height">
				<div class="modal-body">
					<h1>Register to save your checklists</h1>
					<p class="red--text">&nbsp;{{getRegistrationError}}</p>
					<v-form v-model="valid">
						<v-text-field
							name="displayName"
							label="Display name"
							v-model="displayName"
							@keyup.enter="onSignup"
							required
							@blur="displayNameBlurred = true"
							:rules="displayNameRules"
						>
						</v-text-field>
						<v-text-field 
							name="email"
							label="Email"
							v-model="email"
							@blur="emailBlurred = true"
							:rules="emailRules"
							type="email"
							required
							@keyup.enter="onSignup"
						>
						</v-text-field>
						<v-text-field 
							name="password"
							label="Password"
							v-model="password"
							type="password"
							@blur="passwordBlurred = true"
							:rules="passwordRules"
							required
							@keyup.enter="onSignup"
						>
						</v-text-field>
						<transition name="shrink">
							<div v-if="password !== null && password !== ''" class="password-strength__container">
								<p>Password strength: {{getPasswordStrength}}</p>
								<div class="password-strength__blocks">
									<div class="password-strength__block--weak password-strength__block">
									</div>
									<div :class="{'password-strength__block--off': getPasswordStrength === 'weak', 'password-strength__block--strong': getPasswordStrength !== 'weak' , 'password-strength__block': true}">
									</div>
									<div :class="{'password-strength__block--off': getPasswordStrength !== 'mighty', 'password-strength__block--mighty': getPasswordStrength === 'mighty', 'password-strength__block': true}">
									</div>
								</div>
							</div>
						</transition>
						<v-text-field 
							name="confirmPassword"
							label="Confirm Password"
							v-model="confirmPassword"
							type="password"
							:rules="[comparePasswords]"
							@blur="confirmPasswordBlurred = true"
							required
							@keyup.enter="onSignup"
							class="confirm-password"
						>
						</v-text-field>
					</v-form>
					<div class="full-width-row--centered">
						<v-btn flat class="submit-button accent" :loading="loading" :disabled="!formValid" @click="onSignup">Register</v-btn>
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
			displayName: null,
			email: null,
			password: null,
			confirmPassword: null,
			valid: false,
			displayNameBlurred: false,
			emailBlurred: false,
			passwordBlurred: false,
			confirmPasswordBlurred: false,
			loading: false,
			displayNameRules: [
				v => (!!v || !this.displayNameBlurred) || 'Display name is required'
			],
			emailRules: [
				v => (!!v || !this.emailBlurred) || 'E-mail is required',
				v => (/^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || !this.emailBlurred) || 'E-mail must be valid'
			],
			passwordRules: [
				v => (!!v || !this.passwordBlurred) || 'Password is required',
				v => (/^(?=.{8,})/.test(v) || !this.passwordBlurred) || 'Password must be at least 8 characters',
				v => (/^(?=.*[a-z])/.test(v) || !this.passwordBlurred) || 'Password must contain at least 1 lowercase alphabetical letter',
				v => (/^(?=.*[0-9])/.test(v) || !this.passwordBlurred) || 'Password must contain at least 1 numeric character'
			]
		}
	},
	methods: {
		...mapActions([
			'setModalOpen',
			'emailRegistration',
			'setAuthError',
			'setSnackbarText',
			'setMenuOpen'
		]),
		onSignup () {
			if (this.password !== this.confirmPassword) {
				this.setAuthError({prop: 'registration_error_message', value: 'Passwords must match'})
			} else {
				this.loading = true
				this.emailRegistration({email: this.email, password: this.password, displayName: this.displayName}).then((successful) => {
					this.loading = false
					if (successful) {
						this.setSnackbarText('Hello, ' + this.displayName)
						this.open = false
						this.setMenuOpen(false)
					}
				})
			}
		}
	},
	computed: {
		...mapGetters(['getModalOpen', 'getRegistrationError', 'getUsername']),
		open: {
			get () {
				if (this.displayName === null) {
					this.displayName = this.getUsername
				}
				return this.getModalOpen('emailRegistrationModal')
			},
			set (value) {
				if (value === false) {
					this.setAuthError({prop: 'registration_error_message', value: null})
					this.valid = false
					this.displayName = null
					this.email = ''
					this.password = ''
					this.confirmPassword = ''
					this.emailBlurred = false
					this.passwordBlurred = false
					this.confirmPasswordBlurred = false
				}
				this.setModalOpen({prop: 'emailRegistrationModal', value: value})
			}
		},
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'xs') {
				return true
			}
		},
		comparePasswords () {
			return (this.password !== this.confirmPassword) ? 'Passwords do not match' : true
		},
		formValid () {
			if (!this.emailBlurred || !this.passwordBlurred || this.confirmPassword === null) {
				return false
			} else {
				return this.valid
			}
		},
		getPasswordStrength () {
			if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(this.password)) {
				return 'mighty'
			} else if (/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/.test(this.password)) {
				return 'strong'
			} else {
				return 'weak'
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
.confirm-password {
	background-color: white;
}
.password-strength__container {
	margin-top: 5px;

	height: 35px;
	transition: 1s;
	display: flex;
	flex-direction: column;
	z-index: -1;
	p {
		margin: 0 0 0 1px!important;
		color: #444!important;
		font-family: 'Inconsolata', monospace;
	}
}
.password-strength__blocks {
	display: flex;
}
.password-strength__block {
	height: 5px;
	width: 60px;
	margin: 2px;
	&--off {
		background-color: #DDD;
	}
	&--weak {
		background-color: #FF6767;
		margin-left: 0px;
	}
	&--strong {
		background-color: #56DEF1;
	}
	&--mighty {
		background-color: #71F54E;
	}
}
.shrink-enter-active, .shrink-leave-active {
	transition: height 0.25s;
}
.shrink-enter, .shrink-leave-to {
	height: 0;
}
.modal-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 48px;
	h1 {
		margin-bottom: 15px;
		text-decoration: underline;
		font-size: 2.0em;
		color: #4A4A4A;
	}

	p {
		color: #851D22;
		margin-bottom: 5px;
	}
}
.modal-footer {
	padding: 7px 0 20px 0;
	width: 100%;
	text-align: center;
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
	.modal-footer {
		margin-bottom: 5vh;
	}
}
</style>
