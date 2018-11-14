<template>
	<v-snackbar
		color="accent"
		v-model="open"
		bottom
		left
	>
		<p class="snackbar-text">{{ getSnackbarText }}</p>
		<v-btn flat class="snackbar-close-button white--text" @click="open=false">
			<i class="fal fa-times pl-2 pr-2" style="font-size: 1.3em;"></i>
		</v-btn>
	</v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	methods: {
		...mapActions(['setSnackbarOpen'])
	},
	computed: {
		...mapGetters(['getSnackbarOpen', 'getSnackbarText']),
		open: {
			get () {
				return this.getSnackbarOpen
			},
			set (value) {
				this.setSnackbarOpen(value)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.snackbar-close-button {
	padding: 0 5px 0 5px!important;
	width: 30px!important;
	min-width: 30px!important;
}
.snackbar-text {
	font-family: 'Roboto', sans-serif;
	margin: 0;
	font-weight: 700;
	font-size: 1.1em;
}
</style>