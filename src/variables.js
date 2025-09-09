module.exports = {
	initVariables() {
		let variables = []

		/*for (let i = 0; i < this.CHOICES_OUTLETS.length; i++) {
			let outlet = this.CHOICES_OUTLETS[i];
			variables.push({variableId: `outlet_${outlet.id}_state`,  name: `Outlet ${outlet.label} State`})
		}*/

		this.setVariableDefinitions(variables)
	},

	checkVariables() {
		try {
			//set outlet state variables
			/*
			let variableObj = {};

			for (let i = 0; i < this.CHOICES_OUTLETS.length; i++) {
				let outlet = this.CHOICES_OUTLETS[i];
				variableObj[`outlet_${outlet.id}_state`] = (this.OUTLET_STATES[outlet.id] == true) ? 'On' : 'Off';
			}

			this.setVariableValues(variableObj);
			*/
		} catch (error) {
			this.log('error', `Error checking variables: ${error.toString()}`)
		}
	},
}
