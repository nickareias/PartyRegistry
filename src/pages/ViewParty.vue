<template>
	<div :class="{'mobile-container': isMobile}">
		<div v-if="getEvent" class="party-list" :style="getMarginTop">
			<div :style="getPartyListStyle" class="text-xs-center border-bottom">
				<!-- <h1 class="mb-0" v-if="getEventOwnerName">{{getEventOwnerName}}'s</h1> -->
				<div class="event-title">
					<v-text-field
						v-if="editingEventTitle"
						solo
						id="event-title-input"
						class="event-title-input"
						outline
						flat
						v-model="eventTitle"
						hide-details
						@keyup.enter="finishTitle"
						@blur="blurFinishTitle"
						placeholder="Event Title"
					>
					</v-text-field>
					<h1 v-else-if="eventTitle === null || eventTitle === ''" class="text-xs-center mb-0 party-title" style="display: inline; margin-botom: 0px;" @click="editEventTitle">&nbsp;{{getHeaderMessage}}<span :style="getCaretStyle">|</span></h1>
					<h1 v-else class="text-xs-center party-title" @click="editEventTitle">{{eventTitle}}</h1>
				</div>
				<!-- <h1>Party</h1> -->
				<h1 class="text-xs-center">Checklist</h1>
			</div>
			<div :style="getPartyListStyle" :class="{'mobile-view-list-container': isMobile}">
				<div v-for="(item, index) in getItems" class="item">
					<div v-if="editingItemIndex === index">
						<v-text-field
							solo
							flat
							v-model="tempItemEdit"
							hide-details
							:id="'editItem-' + index"
							class="new-item-input"
							outline
							@keyup.enter="finishEditingItem(index)"
							@blur="finishEditingItem(index)"
						>
						</v-text-field>
					</div>
					<div v-else class="item-name-container">
						<v-btn @click="removeItem(index)" v-if="isAdder(index) || isOwner" flat class="remove-item-button icon-button--red"><i class="fa fa-trash"></i></v-btn>
						<p :class="{'item-name': true, 'item-name-padding': (!isAdder(index) && !isOwner)}" @click="editItem(index)">{{item.name}}</p>
					</div>
					<v-text-field
						:id="'bringer_' + index" 
						solo 
						flat
						hide-details
						v-show="bringIndex === index" 
						class="name-input"
						outline
						@keyup.enter="finish(index)"
						placeholder="Add your name"
						v-model="tempBringer"
						@blur="blurFinish(index)"
						style="padding: 1px 0 1px 0;"
					>		
					</v-text-field>
					<div v-if="bringIndex !== index" style="display: flex; flex-direction: row; justify-content: flex-end; align-items: center;">
						<p v-if="item.bringer" class="ma-0 bringer-name" @click="editName(index)">{{item.bringer.displayName}}</p>
						<v-btn @click="uncheck(index)" v-if="getItems[index].bringer" flat class="checkbox-button" :style="getCheckboxStyle(index)" :disabled="getCheckboxDisabled(index)"><i class="far fa-check-square checkbox-icon"></i></v-btn>
						<v-btn @click="check(index)" v-else flat class="checkbox-button unchecked"><i class="far fa-square checkbox-icon"></i></v-btn>
					</div>
				</div>
				<v-btn flat class="new-item-button" @click="addNewItem" v-if="!addingNewItem">
					Add item<i class="ml-3 fa fa-plus" style="padding-bottom: 1px;"></i>
				</v-btn>
				<div class="new-item-box" v-else>
					<v-text-field
						id="newItemInput"
						class="new-item-input"
						outline
						placeholder="Item name"
						hide-details
						flat
						solo
						v-model="newItemName"
						@keyup.enter="finishAddingNewItem"
						@blur="finishAddingNewItem"
					></v-text-field>
				</div>
			</div>
			<div class="hidden-sm-and-down mt-5 mb-5">
			</div>
			<!-- <div style="display: flex; flex-direction: column; align-items: center;">
				<h1>What do we need?</h1>
				<div class="divider"></div>
				<div v-for="(item, index) in getItems" style="width: 100%;" class="item">
					<p class="item-name" style="padding: 8px 16px 8px 16px;">{{item.name}}</p>
				</div>
			</div>
			<div style="display: flex; flex-direction: column; align-items: center;">
				<h1>Who's bringing it?</h1>
				<div class="divider"></div>
				<div v-for="(item, index) in getItems" style="width: 100%;" class="item">
					<v-text-field
						:id="'bringer_' + index" 
						solo 
						v-show="bringIndex === index" 
						class="mt-2 mb-2"
						@keyup.enter="finish(index)"
						placeholder="Add your name"
						v-model="tempBringer"
					>		
					</v-text-field>
					<div v-if="bringIndex !== index" class="ma-0 pa-0">
						<div v-if="item.bringer !== ''" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
							<p class="item-name" style="padding: 8px 16px 8px 16px; flex-shrink: 20;">{{item.bringer}}</p>
							<v-btn @click="remove(index)" icon v-if="item.bringer === getUsername" class='icon-button--red'>
								<i class="far fa-times"></i>
							</v-btn>
						</div>
						<v-btn @click="bring(index)" block class="add-button" v-else><i style="font-size: 1.8em;" class="fal fa-gift"></i></v-btn>
					</div>
				</div>
			</div> -->
		</div>
		<div v-else>
		</div>
	</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
	data () {
		return {
			newItemName: '',
			editingEventTitle: false,
			tempEventTitle: null,
			clickDown: false,
			editWait: false,
			headerMessages: [
				'Party',
				'Camping Trip',
				'Barbeque',
				'Get Together',
				'Graduation',
				'Bar Mitsvah',
				'Beach Day',
				'New Years Bash',
				'Going Away'
			],
			headerMessageDirection: 1,
			headerMessageIndex: 0,
			currentMessageIndex: 0,
			caretVisible: false,
			tempItemsChecked: [
			],
			bringIndex: -1,
			tempBringer: '',
			addingNewItem: false,
			editingItemIndex: -1,
			tempItemEdit: ''
		}
	},
	mounted () {
		setTimeout(this.updateHeaderMessage, 500)
		setTimeout(this.flashCaret, 200)

		document.addEventListener('mousedown', () => {
			this.clickDown = true
		})
		document.addEventListener('mouseup', () => {
			this.clickDown = false
			setTimeout(() => {
				this.editWait = false
			}, 3)
		})
	},
	methods: {
		...mapActions([
			'setItems',
			'setUsername',
			'updateEvent'
		]),
		editItem (index) {
			if (this.isAdder(index) || this.isOwner) {
				this.editingItemIndex = index
				this.tempItemEdit = this.getItems[index].name
				console.log(this.editingItemIndex)
				setTimeout(() => {
					document.getElementById('editItem-' + index).focus()
				}, 5)
			}
		},
		finishEditingItem (index) {
			if (this.editingItemIndex !== -1) {
				this.editingItemIndex = -1
				let temp = Object.assign([], this.getItems)
				if (this.tempItemEdit !== '') {
					temp[index].name = this.tempItemEdit
					this.tempItemEdit = ''
					this.updateEvent({'items': temp})
				}
			}
		},
		isAdder (index) {
			if (this.getItems[index].adder) {
				if (this.user) {
					if (this.getItems[index].adder === this.user.uid) {
						return true
					}
				}
			}
		},
		removeItem (index) {
			let temp = Object.assign([], this.getItems)
			temp.splice(index, 1)
			this.updateEvent({'items': temp})
		},
		addNewItem () {
			this.addingNewItem = true
			setTimeout(() => {
				document.getElementById('newItemInput').focus()
			}, 5)
		},
		finishAddingNewItem () {
			if (this.addingNewItem) {
				this.addingNewItem = false
				if (this.newItemName !== '') {
					let tempBringer = null
					if (this.user.displayName) {
						tempBringer = {displayName: this.user.displayName, uid: this.user.uid}
					}
					console.log(this.newItemName)
					let tempItem = {name: this.newItemName, bringer: tempBringer, quantity: 1, adder: this.user.uid}

					let tempItems = Object.assign([], this.getItems)
					tempItems.push(tempItem)
					this.updateEvent({'items': tempItems})
				}
				this.newItemName = ''
			}
		},
		editName (index) {
			if (!this.getCheckboxDisabled(index)) {
				this.bringIndex = index
				this.tempBringer = this.getUsername
				setTimeout(() => {
					let box = document.getElementById('bringer_' + index)
					box.focus()
				}, 5)
			}
		},
		editEventTitle () {
			if (this.isOwner) {
				this.editingEventTitle = true
				setTimeout(() => {
					document.getElementById('event-title-input').focus()
				}, 5)
			}
		},
		finishTitle () {
			this.editingEventTitle = false
			this.updateEvent({'title': this.tempEventTitle})
		},
		blurFinishTitle () {
			this.finishTitle()
			if (this.clickDown === true) {
				this.editWait = true
			}
		},
		check (index) {
			console.log(this.user)
			if (this.getUsername !== null && this.getUsername !== '') {
				let temp = Object.assign([], this.getItems)
				temp[index].bringer = {displayName: this.user.displayName, uid: this.user.uid}
				this.updateEvent({'items': temp})
				this.tempBringer = ''
				this.bringIndex = -1
			} else {
				this.bringIndex = index
				setTimeout(() => {
					let box = document.getElementById('bringer_' + index)
					box.focus()
				}, 5)
			}
		},
		uncheck (index) {
			let temp = Object.assign([], this.getItems)
			temp[index].bringer = null
			this.updateEvent({'items': temp})
			this.tempBringer = ''
			this.bringIndex = -1
		},
		blurFinish (index) {
			this.finish(index)
			if (this.clickDown === true) {
				this.editWait = true
			}
		},
		finish (index) {
			if (this.bringIndex !== -1) {
				let temp = Object.assign([], this.getItems)
				// Only use this name edit functionality to set the username if the user doesn't already have a name
				if (this.getUsername === null || this.getUsername === '') {
					this.setUsername({displayName: this.tempBringer})
				}
				if (this.tempBringer !== '') {
					temp[this.bringIndex].bringer = {displayName: this.tempBringer, uid: this.user.uid}
				}
				// for (var i = 0; i < temp.length; i++) {
				// 	if (temp[i].bringer) {
				// 		if (this.user) {
				// 			if (temp[i].bringer.uid === this.user.uid) {
				// 				temp[i].bringer = {displayName: this.tempBringer, uid: this.user.uid}
				// 			}
				// 		}
				// 	}
				// }
				this.updateEvent({'items': temp})
				this.tempBringer = ''
				this.bringIndex = -1
			}
		},
		remove (index) {
			let temp = Object.assign([], this.getItems)
			temp[index].bringer = ''
			this.updateEvent({'items': temp})
			this.tempBringer = ''
			this.bringIndex = -1
		},
		updateHeaderMessage () {
			if (this.currentMessageIndex === 0 && this.headerMessageDirection === -1) {
				this.headerMessageIndex = ((this.headerMessageIndex + 1) % (this.headerMessages.length))
				this.headerMessageDirection = 1
			} else {
				if (this.headerMessageDirection === 1 && this.currentMessageIndex === this.headerMessages[this.headerMessageIndex].length) {
					this.headerMessageDirection = -1
					this.currentMessageIndex = this.headerMessages[this.headerMessageIndex].length
					setTimeout(this.updateHeaderMessage, 2000)
					return
				}
				this.currentMessageIndex += this.headerMessageDirection
			}
			setTimeout(this.updateHeaderMessage, 100)
		},
		flashCaret () {
			this.caretVisible = !this.caretVisible
			setTimeout(this.flashCaret, 600)
		},
		itemChecked (index) {
			if (this.getItems[index].bringer !== '') {
				return true
			}
		},
		getCheckboxStyle (index) {
			if (this.getCheckboxDisabled(index)) {
				return {
					'color': '#A9B8E3!important'
				}
			} else {
				return {
					'color': '#495D9A!important'
				}
			}
		},
		getCheckboxDisabled (index) {
			if (this.getItems[index].bringer !== '' && this.getItems[index].bringer !== null) {
				if (this.user) {
					if (this.getItems[index].bringer.uid !== this.user.uid) {
						return true
					}
				}
			}
		}
	},
	computed: {
		...mapGetters([
			'getItems',
			'getEvent',
			'getUsername',
			'user',
			'getEventOwnerName',
			'getEventTitle'
		]),
		isOwner () {
			if (this.user && this.getEvent) {
				if (this.user.uid === this.getEvent.owner) {
					return true
				}
			}
		},
		eventTitle: {
			get () {
				return this.getEventTitle
			},
			set (value) {
				this.tempEventTitle = value
			}
		},
		getSize () {
			return this.$vuetify.breakpoint.name
		},
		getPartyListStyle () {
			let width = ''
			if (this.getSize === 'xl') {
				width = '60%'
			} else if (this.getSize === 'lg') {
				width = '70%'
			} else if (this.getSize === 'md') {
				width = '80%'
			} else if (this.getSize === 'sm') {
				width = '90%'
			} else {
				width = '100%'
			}
			return {
				'width': width
			}
		},
		getMarginTop () {
			let margin = ''
			if (this.getSize === 'xs') {
				margin = '0px 0 0 0'
			} else {
				margin = '46px 0 0 0'
			}
			return {
				'margin': margin
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
		}
	}
}
</script>

<style lang="scss" scoped>
.border-bottom {
	border-bottom: 1px solid #DDD;
	padding-bottom: 30px;
}
.new-item-input {
	margin: 0 2px 0 2px!important;
}
.remove-item-button {
	width: 30px!important;
	min-width: 30px!important;
}
.item-name-padding {
	padding: 8px 16px 8px 16px;
}

.new-item-box {
	height: 65px;
	border-bottom: 1px solid #DDD;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.add-new-item-label {
	font-size: 1.2em;
	color: #999;
	margin: 0px;
}

.new-item-button {
	width: 100%;
	color: #AAA!important;
	margin: 0px!important;
	height: 65px!important;
	text-transform: none!important;
	border-bottom: 1px solid #DDD;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: baseline;
	font-size: 1.2em;
}

.bringer-name {
	font-size: 1.3em;
	color: #888;
}
.event-title {
	width: 100%;
	margin-top: 4px;
	min-height: 48px;
}
.event-title-input {
	height: 48px;
	width: 70%;
	margin-left: 15%!important;
	margin-top: 0px;
	margin-bottom: 0px;
}
.blue-glow {
	box-shadow: 0px 2px 12px #69B4BE!important;
	outline: 1px solid #A0D6DE!important;
}
.checkbox-button {
	width: 40px!important;
	min-width: 40px!important;
	border-radius: 5px;
	&.unchecked {
		color: #333!important;
	}	
}

.checkbox-icon {
	font-size: 1.5em;
}
.item-checkbox {
	flex-shrink: 100;
	width: 50px!important;
	.input-group__input {
		width: 50px!important;
		min-width: 50px!important;
		flex-shrink: 100;
	}
}

.party-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	.name-input {
		max-width: 50%;
		margin-right: 1px;
	}
	.item-name-container {
		max-width: 50%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: baseline;
	}
	h1 {
		font-size: 2.5em;
		line-height: 1.2em;
		color: #444;
	}
}

.item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 8px 0 8px 0;
	border-bottom: 1px solid #DDD;
	height: 70px;
}

.divider {
	height: 1px;
	width: 100%;
}

@media screen and (max-width: 599px) {
	.party-list {
		margin-top: 75px!important;
		padding: 0px;
		h1 {
			font-size: 2.5em;
		}
	}
}
</style>