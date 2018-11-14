<template>
	<div :class="{'mobile-container': isMobile}">
		<div :class="{'header-container': !firstFocus, 'header-container-transition': firstFocus}">
			<h1 class="text-xs-center">What do you need</h1>
			<h1 class="text-xs-center dynamic-header">for your party?</h1>
			<!-- <h1 class="text-xs-center dynamic-header" style="display: inline;">{{getHeaderMessage}}<span :style="getCaretStyle">|</span></h1> -->
		</div>
		<div style="display: flex; flex-flow: row; align-items: center; margin-bottom: 17px;" :class="{'input-after-focus': firstFocus}">
			<v-text-field 
				:class="{'elevation-8': focused, 'blue-glow': focused, 'elevation-3': !focused}" 
				@keyup.enter="add(itemInput)" 
				v-model="itemInput" 
				flat
				solo
				hide-details
				placeholder="Add an item"
				@focus="focusInput()"
				@blur="focused=false"
			>
			</v-text-field>
			<v-btn @click="add(itemInput)" class="add-button mr-0">Add</v-btn>
		</div>
		<div :class="{'mobile-create-list-container': isMobile, 'pt-3': true, 'mt-3': !isMobile}" style="padding-bottom: 60px;" v-if="items.length > 0">
			<!-- <v-divider class="mb-2">
			</v-divider> -->
			<div v-for="(item, index) in items">
				<div class="list-item mb-2">
					<div style="display: flex; flex-direction: row; align-items: center; width: 55%;">
						<!-- <v-btn icon flat class="ma-0 icon-button icon-button--red"><i class="fas fa-minus"></i></v-btn>
						<v-btn icon flat class="ma-0 icon-button icon-button--green"><i class="fas fa-plus"></i></v-btn> -->
						<v-text-field outline hide-details :id="'item-' + index" solo v-show="canEditItem(index)"  flat @blur="blurFinishEditing" @keyup.enter="finishEditing" :disabled="!canEditItem(index)" v-model="items[index].name" class="ma-0 item-name"></v-text-field>
						<p class="item-name" style="padding: 8px 16px 8px 16px;" v-if="!canEditItem(index)">{{item.name}}</p>
						<!-- <span class="mt-0 mb-0 item-name" style="margin: 0 10px 0 10px;">x&nbsp;{{item.quantity}}</span> -->
					</div>
					<div class="list-item__button-container">
						<div>
							<v-btn icon v-if="canEditItem(index)" @click="finishEditing" flat class="ma-0 icon-button icon-button--green" style="margin-right: 5px!important;"><!-- <v-icon>fas fa-check</v-icon> --><i class="fas fa-check"></i></v-btn>
							<v-btn icon style="margin-right: 5px!important;" v-else @click="edit(index)" flat class="ma-0 icon-button icon-button--orange"><i class="fas fa-pen"></i></v-btn>
							<v-btn icon @click="remove(index)" flat class="ma-0 icon-button icon-button--red"><i class="fas fa-trash"></i></v-btn>
						</div>
					</div>
				</div>
				<!-- <v-divider class="mb-2">
				</v-divider> -->
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
	data () {
		return {
			firstFocus: false,
			editWait: false,
			clickDown: false,
			clickUp: false,
			editItemIndex: -1,
			items: [],
			itemQuantities: [],
			itemInput: '',
			focused: false,
			headerMessages: [
				'for your party?',
				'to watch the big game?',
				'for your camping trip?',
				'for the family gathering?',
				'to get the party started?',
				'for the 4th of July?',
				'for game night?'
			],
			headerMessageDirection: 1,
			headerMessageIndex: 0,
			currentMessageIndex: 0,
			caretVisible: false,
			isFirstItemAdded: false
		}
	},
	mounted () {
		if (this.getEvent !== null) {
			if (this.getEvent.owner !== this.user.uid) {
				this.clearEvent()
			} else {
				this.setItems(this.getItems)
			}
		}
		this.items = Object.assign([], this.computedItems)
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
			'clearEvent'
		]),
		focusInput () {
			this.focused = true
			if (this.isMobile) {
				this.firstFocus = true
			}
		},
		add (item) {
			if (this.isFirstItemAdded === false) {
				this.isFirstItemAdded = true
				this.$parent.$emit('itemAdded')
			}
			this.items.push({name: item, quantity: 1, bringer: null, adder: this.user.uid})
			this.computedItems = this.items
			this.itemInput = ''
		},
		remove (index) {
			this.items.splice(index, 1)
			this.computedItems = this.items
		},
		edit (index) {
			if (!this.editWait) {
				setTimeout(() => {
					document.getElementById('item-' + index).focus()
				}, 5)
				this.editItemIndex = index
				this.computedItems = this.items
			}
		},
		blurFinishEditing () {
			this.finishEditing()
			if (this.clickDown === true) {
				this.editWait = true
			}
		},
		finishEditing () {
			this.editItemIndex = -1
			this.computedItems = this.items
		},
		canEditItem (index) {
			return index === this.editItemIndex
		},
		getItemStyle (index) {
			return {
				'color': 'black'
			}
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
		}
	},
	computed: {
		...mapGetters([
			'getItems',
			'getLocalItems',
			'getEvent',
			'user'
		]),
		computedItems: {
			get () {
				return this.getLocalItems
			},
			set (value) {
				this.setItems(this.items)
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

<style lang="scss">
.header-container-transition {
	transition: 1.0s;
	opacity: 0;
	transform: translate(0, -100%);
	height: 0px!important;
}
.input-after-focus {
	margin-top: 75px;
	margin-bottom: 17px;
	transition: 1.0s;
	text-align: center;
}
.blue-glow {
	outline: 2px solid #56DEF1!important;
}
</style>