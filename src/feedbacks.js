const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks() {
		let feedbacks = {}

		/*feedbacks['outlet_state'] = {
			type: 'boolean',
			name: 'Outlet is On',
			description: 'Show feedback for Outlet State',
			options: [
				{
					type: 'dropdown',
					label: 'Outlet',
					id: 'outlet',
					default: this.CHOICES_OUTLETS[0].id,
					choices: this.CHOICES_OUTLETS
				}
			],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 0, 0)
			},
			callback: (event) => {
				let opt = event.options
				if (this.OUTLET_STATES[event.options.outlet] == true) {
					return true
				}
				return false
			},
		}*/
		
		this.setFeedbackDefinitions(feedbacks)
	}
}