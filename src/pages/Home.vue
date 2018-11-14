<template>
	<v-layout row class="create-party">
		<div v-if="!isMobile" class="background">
		</div>
		<div v-if="isMobile" class="mobile-submit" :style="getMobileSubmitStyle">
			<v-btn v-if="currentRoute === 'CreateParty'" @click="createParty" flat class="mobile-submit__button"><i style="font-size: 1.8em;" class="fas fa-arrow-right"></i></v-btn>
			<v-btn v-else-if="currentRoute === 'ViewParty'" @click="shareParty" flat class="mobile-submit__button"><i style="font-size: 1.8em;" class="fas fa-share-alt"></i></v-btn>
		</div>
		<v-flex xs12 sm10 offset-sm1 md8 lg7 xl5 offset-lg1 offset-xl2>
			<transition 
				name="slide-fade"
				mode="out-in"
			>
				<router-view></router-view>
			</transition>
		</v-flex>
		<v-flex lg4 md4 class="hidden-sm-and-down pt-5 sticky-card-container" v-if="tipCardState !== 'Profile'">
			<v-card class="elevation-7 sticky-card" :style="getTipCardStyle">
				<div v-if="tipCardState === 'CreateParty'" class="sticky-card-content">
					<div class="sticky-card-header mb-2">
						<h1 class="mb-0">Hello!</h1>
						<v-btn flat class="tip-card-help-button info--text" @click="helpModal"><p>How does it work?</p></v-btn>
					</div>
					<p>Once you're done adding items, send the list to your friends so they can help out.</p>
					<v-btn flat class="view-button" :loading="loading" :disabled="getItems.length === 0" @click="createParty">SHARE</v-btn>
				</div>
				<div v-else-if="tipCardState === 'ViewParty' && isOwner" class="sticky-card-content">
					<h1 class="mb-2">Looks good!</h1>
					<p>Check off what you're bringing and send the list out to your friends.</p>
					<div style="display: flex; flex-direction: column; align-items: center;">
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
				<div v-else-if="tipCardState === 'ViewParty'" class="sticky-card-content__view--guest">
					<h1 class="mb-2">Welcome!</h1>
					<p>Check off any items that you can bring. And feel free to add some new items that aren't listed.</p>
					<div class="sticky-card-footer__view--guest">
						<img height="60px" width="60px" src="@/assets/baloons-brighter.png">
					</div>
				</div>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
	props: {
		duration: {
			default: false
		}
	},
	data () {
		return {
			loading: false,
			currentRoute: this.$route.name,
			tipCardState: null,
			editItemIndex: -1,
			itemQuantities: [],
			itemInput: '',
			focused: false,
			headerMessages: [
				'for your party?',
				'for your family gathering?',
				'to get the party started?',
				'for your camping trip?',
				'to watch the big game?',
				'for the 4th of July?',
				'for game night?'
			],
			headerMessageDirection: 1,
			headerMessageIndex: 0,
			currentMessageIndex: 0,
			caretVisible: false,
			tipCardOffset: 30,
			tipCardAccel: 0.01,
			tipCardVel: 10,
			tipCardSpeed: 0.03,
			tipCardDirection: -1,
			TipCardEnd: 0,
			time: 0,
			submitContainerPosition: 100,
			submitContainerOffset: 70,
			submitContainerAccel: 0.3,
			submitContainerAmplitude: 100,
			submitContainerDecel: 0.91,
			submitContainerPeriod: 0.2,
			submitContainerVel: 2,
			submitContainerSpring: -0.01,
			submitContainerDirection: -1,
			submitContainerTimeScale: 25
		}
	},
	mounted () {
		setTimeout(this.slideCard, 2500)
		this.$on('itemAdded', () => {
			if (!this.isMobile) {
				// setTimeout(this.slideCard, 500)
			} else {
				setTimeout(this.slideSubmitContainer, 500)
			}
		})
		// if (this.isMobile && this.getUserProp('firstTime')) {
		// 	this.setModalOpen({prop: 'mobileTutorialModal', value: true})
		// 	this.setUserProp({prop: 'firstTime', value: false})
		// }
	},
	watch: {
		'$route': function (newVal, oldVal) {
			this.currentRoute = newVal.name
			if (newVal.name === 'Profile') {
				this.tipCardDirection = 1
			}
			if (oldVal.name === 'Profile') {
				setTimeout(this.slideCard, 1500)
			} else {
				this.slideCard()
			}
		}
	},
	methods: {
		...mapActions(['setModalOpen', 'setUserProp', 'setEvent', 'saveEvent', 'updateEvent', 'setSnackbarOpen', 'setSnackbarText']),
		copyLink () {
			this.setSnackbarOpen(true)
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
		},
		createParty () {
			if (this.getEvent !== null) {
				this.updateEvent({'items': this.getLocalItems})
				this.slideCard()
				this.$router.push('/' + this.getEventReference.id)
			} else {
				this.loading = true
				this.saveEvent({user: this.user.uid, items: this.getLocalItems}).then((response) => {
					console.log('response id')
					console.log(response.id)
					this.slideCard()
					this.$router.push('/' + response.id)
					this.loading = false
				}).catch((error) => {
					console.log(error)
					this.loading = false
				})
			}
		},
		shareParty () {
			this.setModalOpen({prop: 'sharePartyModal', value: true})
		},
		helpModal () {
			this.setModalOpen({prop: 'helpModal', value: true})
		},
		updateHeaderMessage () {
			if (this.currentMessageIndex === 0 && this.headerMessageDirection === -1) {
				this.headerMessageIndex = ((this.headerMessageIndex + 1) % (this.headerMessages.length))
				this.headerMessageDirection = 1
			} else {
				if (this.headerMessageDirection === 1 && this.currentMessageIndex === this.headerMessages[this.headerMessageIndex].length) {
					this.headerMessageDirection = -1
					this.currentMessageIndex = this.headerMessages[this.headerMessageIndex].length
					setTimeout(this.updateHeaderMessage, 1500)
					return
				}
				this.currentMessageIndex += this.headerMessageDirection
			}
			setTimeout(this.updateHeaderMessage, 85)
		},
		flashCaret () {
			this.caretVisible = !this.caretVisible
			setTimeout(this.flashCaret, 600)
		},
		slideCard () {
			if (this.tipCardOffset > 0 && this.tipCardDirection === -1 && this.currentRoute !== 'Profile') {
				this.tipCardState = this.currentRoute
				this.tipCardOffset += this.tipCardDirection * (this.tipCardSpeed * this.tipCardOffset)
				if (this.tipCardOffset < 0.1) {
					this.tipCardDirection = 1
					this.tipCardOffset = 0
				} else {
					setTimeout(this.slideCard, 5)
				}
			} else if (this.tipCardOffset < 30 && this.tipCardDirection === 1) {
				this.tipCardOffset += this.tipCardSpeed * (this.tipCardOffset + 5)
				if (this.tipCardOffset > 30) {
					this.tipCardOffset = 30
					this.tipCardState = this.currentRoute
					setTimeout(() => {
						this.tipCardDirection = -1
						if (this.currentRoute !== 'Home') {
							this.slideCard()
						}
					}, 1000)
				} else {
					setTimeout(this.slideCard, 5)
				}
			}
		},
		slideSubmitContainer () {
			if (this.submitContainerAmplitude > 2) {
				this.submitContainerPosition = this.submitContainerAmplitude * Math.sin(this.time * this.submitContainerPeriod) + this.submitContainerOffset

				this.submitContainerOffset *= this.submitContainerDecel
				this.submitContainerAmplitude *= this.submitContainerDecel

				this.time += 1

				setTimeout(this.slideSubmitContainer, this.submitContainerTimeScale)
			}
		}
	},
	computed: {
		...mapGetters([
			'getItems',
			'getUserProp',
			'user',
			'getEvent',
			'getLocalItems',
			'getEventReference',
			'getShareUrl'
		]),
		isOwner () {
			if (this.user && this.getEvent) {
				if (this.user.uid === this.getEvent.owner) {
					return true
				}
			}
		},
		getHeaderMessage () {
			return this.headerMessages[this.headerMessageIndex].substring(0, this.currentMessageIndex)
		},
		getCaretStyle () {
			if (this.currentMessageIndex === this.headerMessages[this.headerMessageIndex].length) {
				if (!this.caretVisible) {
					return {
						'color': 'transparent'
					}
				}
			}
		},
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs') {
				return true
			} else {
				return false
			}
		},
		getTipCardStyle () {
			let height = ''
			if (this.tipCardState === 'ViewParty') {
				if (this.isOwner) {
					height = '320px!important'
				} else {
					height = '240px!important'
				}
			} else if (this.tipCardState === 'CreateParty') {
				height = '240px!important'
			}
			return {
				'left': 'calc(72vw + ' + this.tipCardOffset + 'vw)',
				'height': height
			}
		},
		getMobileSubmitStyle () {
			return {
				'right': 'calc(-45px - ' + this.submitContainerPosition + 'px)',
				'bottom': 'calc(-45px - ' + this.submitContainerPosition + 'px)'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.sticky-card-footer__view--guest {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 0;
}
.sticky-card-content__view--guest {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	h1 {
		font-size: 2.4em;
		font-weight: bold;
	}

	p {
		font-size: 1.1em;
		margin: 0px 0px 12px 0px;
	}
}
.sticky-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.tip-card-help-button {
	height: 30px;
	width: 130px!important;
	p {
		margin: 0!important;
		text-transform: capitalize;
		font-size: 0.9em!important;
		font-family: 'Inconsolata', monospace;
		text-decoration: underline;
	}
}
.mobile-submit {
	height: 120px;
	width: 120px;
	border-radius: 100px;
	position: fixed;
	bottom: -45px;
	right: -45px;
	background-color: #FFA858;
	z-index: 3;

	.mobile-submit__button {
		color: white!important;
		border-radius: 5px;
		width: 35px;
		height: 35px;
		min-width: 30px;
		min-height: 30px;
		position: relative;
		top: 19px;
		left: 19px;
	}
}
.slide-fade-leave-active,
.slide-fade-enter-active {
	transition: 1.0s;
}
.slide-fade-enter {
	transform: translate(100%, 0);
	opacity: 0;
}
.slide-fade-leave-to {
	transform: translate(-100%, 0);
	opacity: 0;
}
</style>