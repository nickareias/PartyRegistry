<template>
	<v-dialog :transition="getTransition" :fullscreen="isMobile" scrollable v-model="open" max-width="700px">
		<v-card class="modal-card">
			<div>
				<v-btn @click="open = false" flat class="close-button ma-3"><i style="font-size: 2.4em; color: #888;" class="fal fa-times"></i></v-btn>
			</div>
			<v-card-text class="modal-content pt-0 pb-0 modal-height">
				<div class="modal-body">
					<h1>Get your friends to help out!</h1>
					<p><b>1)</b>&nbsp;&nbsp;Make a list of what you need for your gathering.</p>
					<p><b>2)</b>&nbsp;&nbsp;Share the link with everyone thats going.</p>
					<p><b>3)</b>&nbsp;&nbsp;Your friends will check off what they're bringing.</p>
					<p :class="{'final-message--mobile': isMobile, 'final-message--desktop': !isMobile, 'final-message': true}">It makes it easy to coordinate and let your guests know what you need.</p>
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
		}
	},
	methods: {
		...mapActions(['setModalOpen'])
	},
	computed: {
		...mapGetters(['getModalOpen']),
		open: {
			get () {
				return this.getModalOpen('helpModal')
			},
			set (value) {
				this.setModalOpen({prop: 'helpModal', value: value})
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
.orange {
	background-color: #FFB067!important;
	color: white!important;
	height: 50px;
	width: 120px;
	text-transform: capitalize;
	font-size: 1.3em;
}
.modal-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 36px;
	h1 {
		margin-bottom: 25px;
		text-decoration: underline;
		font-size: 2.5em;
		color: #4A4A4A;
	}

	p {
		b {
			font-weight: 900;
		}
		color: #555;
		font-size: 1.3em;
		margin-bottom: 10px;
	}
	.final-message {
		font-family: 'Montserrat', sans-serif;
		margin-top: 30px;
		font-size: 1.8em;
		font-weight: 300;
		color: #333;
		// padding: 0 40px;
		&--mobile {
			margin-bottom: 20px;
		}
	}
}
.modal-footer {
	padding: 20px 0 20px 0;
	width: 100%;
	text-align: center;
}
@media screen and (max-width: 600px) and (min-height: 500px) {
	.modal-body {
		margin-top: 5vh;
	}
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
