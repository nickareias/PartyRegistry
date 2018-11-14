<template>
	<v-layout :class="{'profile-container-desktop': !isMobile, 'profile-container-mobile': isMobile, 'profile-container': true}" column wrap justify-center>
		<!-- <div class="profile-picture">
		</div> -->
		<h1>Hello {{getUsername}}<span v-if="!getUsername">Anonymous</span>,</h1>
		<a class="ma-0 info--text" v-if="!getUsername" @click="setModalOpen({prop: 'emailRegistrationModal', value: true})">Please register to save your checklists permanently</a>
		<h2>Your saved checklists:</h2>
		<div class="table-header mt-3">
			<div class="table-header--name">
				<p>Name</p>
			</div>
			<div v-if="!isMobile" class="table-header--created">
				<p>Created</p>
			</div>
			<div v-if="!isMobile" class="table-header--updated">
				<p>Updated</p>
			</div>
		</div>
		<div class="checklist-row" v-for="link in getUserEvents">
			<v-btn block class="checklist-row__button" flat @click="goToEvent(link.id)">
				<div v-if="!isMobile" class="checklist-row__button--name"><p>{{getEventName(link)}}</p></div><div v-if="!isMobile" class="checklist-row__button--created"><p>{{getEventCreated(link)}}</p></div><div v-if="!isMobile" class="checklist-row__button--updated"><p>{{getEventUpdated(link)}}</p></div><p v-else>{{getEventName(link)}}</p>
			</v-btn>
		</div>
	</v-layout>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
export default {
	data () {
		return {
		}
	},
	mounted () {
		this.fetchUserEvents()
	},
	methods: {
		...mapActions([
			'setModalOpen',
			'fetchUserEvents'
		]),
		goToEvent (id) {
			this.$router.push('/' + id)
		},
		getEventName (link) {
			if (link.title) {
				return link.title
			} else {
				return link.id
			}
		},
		getEventCreated (link) {
			return moment(link.created).calendar()
		},
		getEventUpdated (link) {
			return moment(link.updated).calendar()
		}
	},
	computed: {
		...mapGetters([
			'getUsername',
			'getUserEvents'
		]),
		isMobile () {
			if (this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs') {
				return true
			} else {
				return false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.table-header {
	display: flex;
	background-color: #EEE;
	align-items: center;
	p {
		margin: 0;
		font-weight: bold;
	}
	&--name {
		padding: 10px;
		width: 33%;
		display: flex;
		align-items: center;
	}
	&--created {
		padding: 4px;
		width: 33%;
		display: flex;
		align-items: center;
	}
	&--updated {
		padding: 4px;
		width: 33%;
		display: flex;
		align-items: center;
	}
}
.checklist-row__button {
	margin: 0;
	padding: 0;
	border-bottom: 1px solid #DDD;
	height: 55px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	p {
		margin: 0;
		text-transform: capitalize;
	}
	&--name {
		padding-left: 5px;
		width: 33%;
		display: flex;
		align-items: center;
	}
	&--created {
		width: 33%;
		display: flex;
		align-items: center;
	}
	&--updated {
		width: 33%;
		display: flex;
		align-items: center;
	}
}
.profile-container {
	padding: 50px 0 0 0;
	h1 {
		font-size: 5.0em;
	}
	h2 {
		margin-top: 30px;
		color: #555;
	}
}
.profile-container-desktop {
	.profile-picture {
		height: 150px;
		width: 150px;
		border-radius: 50%;
		background-color: #DDD;
		margin-bottom: 20px;
	}
}
.profile-container-mobile {
	padding: 20px 26px 0 26px;
	h1 {
		font-size: 2.8em;
	}
	h2 {
		font-size: 1.2em;
	}
	.profile-picture {
		height: 90px;
		width: 90px;
		border-radius: 50%;
		background-color: #DDD;
		margin-bottom: 20px;
	}
}
@media screen and (max-width: 600px) {
	.table-header--name {
		justify-content: center;
		width: 100%;
	}
}
</style>