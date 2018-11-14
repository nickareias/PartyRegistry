<template>
	<v-dialog :transition="getTransition" fullscreen scrollable v-model="open">
		<v-card>
			<div>
				<v-btn @click="open = false" flat class="close-button ma-3"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<div class="modal-content modal-height">
				<h1>Hey this is the tutorial screen</h1>
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
		...mapActions(['setModalOpen']),
		share (method) {
			console.log(method)
		}
	},
	computed: {
		...mapGetters(['getModalOpen']),
		open: {
			get () {
				return this.getModalOpen('mobileTutorialModal')
			},
			set (value) {
				this.setModalOpen({prop: 'mobileTutorialModal', value: value})
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
.modal-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	h1 {
		margin-bottom: 10vh;
		font-size: 2.0em;
		color: #4A4A4A;
	}

	p {
		font-size: 1.1em;
		width: 70%;
		margin-left: 15%;
		color: #666;
	}
}
</style>
