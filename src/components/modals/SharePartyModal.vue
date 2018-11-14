<template>
	<v-dialog :transition="getTransition" fullscreen scrollable v-model="open">
		<v-card>
			<div class="modal-header">
				<v-btn @click="open = false" flat class="close-button"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<div class="modal-content">
				<div class="modal-text-container">
					<h1 class="text-xs-center">Share your party checklist</h1>
					<p class="text-xs-center">Your friends will check off the items that they're bringing</p>
					<p class="text-xs-center">You can come back to this link to view and edit the updated checklist</p>
				</div>
				<div class="share-buttons mb-0">
					<social-sharing
						:url="getShareUrl"
						title="I hope you're all ready for a good time! Check out my Party Registry, and let me know if you can bring anything."
						quote="I hope you're all ready for a good time! Check out my Party Registry, and let me know if you can bring anything."
						inline-template
					>
						<div style="width: 100%;">
							<network network="facebook">
								<v-btn block flat class="share-button fb"><i style="color: white;" class="fab fa-facebook share-icon"></i></v-btn>
							</network>
							<network network="twitter">
								<v-btn block flat class="share-button tw"><i style="color: white;" class="fab fa-twitter share-icon"></i></v-btn>
							</network>
						</div>
					</social-sharing>
					<!-- <v-btn block flat class="share-button fb" @click="shareParty"><i style="color: white;" class="fab fa-facebook share-icon"></i></v-btn> -->
					<!-- <v-btn block flat class="share-button tw" @click="shareParty"><i style="color: white;" class="fab fa-twitter share-icon"></i></v-btn> -->
					<v-btn block flat class="share-button cp" @click="copyLink"><i style="color: white;" class="fas fa-copy share-icon"></i></v-btn>
					<v-btn block flat class="share-button em" @click="setModalOpen({prop: 'emailShareModal', value: true})"><i style="color: white;" class="fas fa-envelope share-icon"></i></v-btn>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
	data () {
		return {
		}
	},
	methods: {
		...mapActions(['setModalOpen', 'setSnackbarOpen', 'setSnackbarText']),
		share (method) {
			console.log(method)
			console.log('share')
		},
		copyLink () {
			this.setSnackbarText('Link copied to clipboard')
			this.copyTextToClipboard(this.getShareUrl)
		},
		copyTextToClipboard (text) {
			var textArea = document.createElement('textarea')
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()

			try {
				var successful = document.execCommand('copy')
				var msg = successful ? 'successful' : 'unsuccessful'
				console.log('Fallback: Copying text command was ' + msg)
			} catch (err) {
				console.error('Fallback: Oops, unable to copy', err)
			}

			document.body.removeChild(textArea)
		}
	},
	computed: {
		...mapGetters(['getModalOpen', 'getShareUrl']),
		open: {
			get () {
				return this.getModalOpen('sharePartyModal')
			},
			set (value) {
				this.setModalOpen({prop: 'sharePartyModal', value: value})
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
.modal-header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 70px!important;
}

.close-button {
	width: 35px!important;
	min-width: 35px!important;
	height: 35px!important;
	min-height: 35px!important;
}

.modal-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: calc(100vh - 70px);
}

.share-buttons {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.modal-text-container {
	h1 {
		margin-bottom: 10px;
		font-size: 2.0em;
		padding: 0 10px 0 10px;
		color: #4A4A4A;
	}

	p {
		font-size: 1.1em;
		width: 80%;
		margin-left: 10%;
		margin-bottom: 10px;
		color: #666;
	}
}

.modal-share-button {
	&.fb {
		background-color: #6689F3!important;
	}
	&.tw {
		background-color: #1DA1F3!important;
	}
	&.cp {
		background-color: #FFB619!important;
	}
	&.em {
		background-color: #FF7A00!important;
	}
	height: 37px;
	margin: 3px 0 0 0;
}

.modal-share-icon {
	font-size: 1.5em;
}

@media screen and (max-width: 599px) and (min-height: 750px) {
	.modal-text-container {
		margin-top: 12vh;
		h1 {
			margin-bottom: 5vh;
			font-size: 2.5em;
		}

		p {
			font-size: 1.3em;
		}
	}

	.modal-share-button {
		height: 50px;
		margin: 3px 0 0 0;
	}

	.modal-share-icon {
		font-size: 2.0em;
	}
}

@media screen and (max-width: 599px) and (min-height: 600px) and (max-height: 749px) {
	.modal-text-container {
		margin-top: 12vh;
		h1 {
			margin-bottom: 5vh;
			font-size: 2.2em;
		}

		p {
			font-size: 1.25em;
		}
	}

	.modal-share-button {
		height: 45px;
		margin: 3px 0 0 0;
	}

	.modal-share-icon {
		font-size: 1.8em;
	}
}

@media screen and (max-width: 599px) and (min-height: 500px) and (max-height: 599px) {
	.modal-text-container {
		margin-top: 6vh;
		h1 {
			margin-bottom: 3vh;
			font-size: 2.0em;
		}

		p {
			font-size: 1.1em;
		}
	}

	.modal-share-button {
		height: 40px;
		margin: 3px 0 0 0;
	}

	.modal-share-icon {
		font-size: 1.6em;
	}
}
</style>
