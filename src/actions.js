const constants = require('./constants')

module.exports = {
	initActions() {
		let actions = {}

		actions.outletOn = {
			name: 'Turn Outlet On',
			options: [
				{
					type: 'dropdown',
					label: 'Outlet',
					id: 'outlet',
					default: this.CHOICES_OUTLETS[0].id,
					choices: this.CHOICES_OUTLETS
				},
				{
					type: 'number',
					label: 'Delay (seconds)',
					id: 'delay',
					default: 0,
					min: 0,
					max: 60,
					required: true,
				}
			],
			callback: async (event) => {
				this.controlOutlet(event.options.outlet, true, event.options.delay);
			}
		}

		actions.outletOff = {
			name: 'Turn Outlet Off',
			options: [
				{
					type: 'dropdown',
					label: 'Outlet',
					id: 'outlet',
					default: this.CHOICES_OUTLETS[0].id,
					choices: this.CHOICES_OUTLETS
				},
				{
					type: 'number',
					label: 'Delay (seconds)',
					id: 'delay',
					default: 0,
					min: 0,
					max: 60,
					required: true,
				}
			],
			callback: async (event) => {
				this.controlOutlet(event.options.outlet, false, event.options.delay);
			}
		}

		actions.outletCycle = {
			name: 'Cycle Outlet',
			options: [
				{
					type: 'dropdown',
					label: 'Outlet',
					id: 'outlet',
					default: this.CHOICES_OUTLETS[0].id,
					choices: this.CHOICES_OUTLETS
				}
			],
			callback: async (event) => {
				this.cycleOutlet(event.options.outlet);
			}
		}

		actions.outletOnAll = {
			name: 'Turn All Outlets On',
			options: [
				{
					type: 'number',
					label: 'Delay (seconds)',
					id: 'delay',
					default: 0,
					min: 0,
					max: 60,
					required: true,
				}
			],
			callback: async (event) => {
				for (let i = 0; i < this.CHOICES_OUTLETS.length; i++) {
					let outlet = (i+1);
					this.controlOutlet(outlet, true);
				}
			}
		}

		actions.outletOffAll = {
			name: 'Turn All Outlets Off',
			options: [
				{
					type: 'number',
					label: 'Delay (seconds)',
					id: 'delay',
					default: 0,
					min: 0,
					max: 60,
					required: true,
				}
			],
			callback: async (event) => {
				for (let i = 0; i < this.CHOICES_OUTLETS.length; i++) {
					let outlet = (i+1);
					this.controlOutlet(outlet, false, event.options.delay);
				}
			}
		}
			
		this.setActionDefinitions(actions)
	}
}