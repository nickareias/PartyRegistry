<template>
	<v-dialog :transition="getTransition" :fullscreen="isMobile" scrollable v-model="open" max-width="700px">
		<v-card class="modal-card">
			<div>
				<v-btn @click="open = false" flat class="close-button ma-3"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<v-card-text class="modal-content pt-0 pb-0 modal-height">
				<div class="modal-body">
					<h1>Send your friends an email.</h1>
					<v-form v-model="valid">
						<v-combobox
							v-model="emailAddresses"
							label="Email addresses"
							outline
							deletable-chips
							chips
							:rules="emailRules"
							multiple
						></v-combobox>
						<v-text-field
							label="Subject"
							v-model="subject"
							placeholder="ex: Need help with party supplies"
							outline
							:rules="subjectRules"
						>
						</v-text-field>
						<v-textarea
							v-model="message"
							label="Message"
							outline
							height="150"
							:rules="messageRules"
						>
						</v-textarea>
						<div class="button-container">
							<v-btn flat :disabled="!valid" :loading="loading" class="accent submit-button" @click="sendEmail">Send</v-btn>
						</div>
					</v-form>
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
			emailAddresses: null,
			subject: null,
			message: null,
			emailRules: [
				v => v.length > 0 || 'You must enter at least one email address'
			],
			subjectRules: [
				v => !!v || 'You must enter a subject'
			],
			messageRules: [
				v => !!v || 'You must enter a message'
			],
			loading: false,
			valid: false
		}
	},
	methods: {
		...mapActions(['setModalOpen', 'sendShareEmail', 'tempSendShareEmail']),
		sendEmail () {
			console.log(this.emailAddresses)
			console.log(this.subject)
			console.log(this.message)
			this.tempSendShareEmail({to: this.emailAddresses, subject: this.subject, message: this.message})
		}
	},
	computed: {
		...mapGetters(['getModalOpen']),
		open: {
			get () {
				return this.getModalOpen('emailShareModal')
			},
			set (value) {
				this.setModalOpen({prop: 'emailShareModal', value: value})
			}
		},
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'xs') {
				return true
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
.button-container {
	display: flex;
	width: 100%;
	justify-content: center;
}
.orange {
	background-color: #FFB067!important;
	color: white!important;
	height: 50px;
	width: 120px;
	text-transform: capitalize;
	font-size: 1.3em;
}
.modal-footer {
	padding: 20px 0 20px 0;
	width: 100%;
	text-align: center;
}
.modal-content {
	padding: 0 36px;
}
@media screen and (max-width: 600px) and (min-height: 500px) {
	.modal-footer {
		margin-bottom: 5vh;
	}
}
@media screen and (max-width: 600px) {
	.modal-content {
		padding: 0 25px;
	}
}
</style>
