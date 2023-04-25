// Eaton ePDU Companion Module
const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const { Telnet } = require('telnet-client')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')
const constants = require('./src/constants')

class moduleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
			...constants
		})

		this.connection = undefined;
		this.connectionReady = false;

		this.pollTimer = undefined;

		this.OUTLET_STATES = [];

		this.CHOICES_OUTLETS = [];
	}

	async destroy() {
		if (this.connection) {
			this.connection.end()
			delete this.connection
		}

		if (this.pollTimer !== undefined) {
			clearInterval(this.pollTimer)
			delete this.pollTimer
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		// polling is running and polling has been de-selected by config change
		if (this.pollTimer !== undefined) {
			clearInterval(this.pollTimer)
			delete this.pollTimer
		}
		this.config = config

		//create outlet choices
		this.CHOICES_OUTLETS = [];
		for (let i = 1; i <= this.config.outlet_count; i++) {
			let outletObj = {
				id: i,
				label: `Outlet ${i}`
			}
			this.CHOICES_OUTLETS.push(outletObj);
		}
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.initTelnet()
	}

	async initTelnet() {
		let self = this;

		this.connection = new Telnet();
		
		const params = {
			host: this.config.host,
			port: 23,
			loginPrompt: 'Enter Login: ',
			passwordPrompt: 'Enter Password: ',
			username: `${this.config.username}\r\n`,
			password: `${this.config.password}\r\n`,
			shellPrompt: 'pdu#0>', // or negotiationMandatory: false
			negotiationMandatory: false,
			timeout: 1500
		}
		
		this.connection.on('data', function (data) {
			self.processResponse(data.toString());
		});
		
		this.connection.on('ready', async function (prompt) {
			if (prompt === 'pdu#0>') {
				self.connectionReady = true;
				self.updateStatus(InstanceStatus.Ok)
			}
			else {
				self.connectionReady = false;
				self.updateStatus(InstanceStatus.Error, 'Invalid prompt received from ePDU')
			}
		});
		
		this.connection.on('error', function (error) {
			console.log('socket error:', error)
		});
		
		try {
			await this.connection.connect(params);
		}
		catch (error) {
			this.log('error', `Error connecting to Eaton ePDU: ${error.toString()}`);
		}
	}

	controlOutlet(outlet, state, delay = 0) {
		let command = 'DelayBeforeStartup';

		if (state == false) {
			command = 'DelayBeforeShutdown';
		}

		this.log('info', `Setting Outlet ${outlet} to ${(state ? 'On' : 'False')} with delay of ${delay} seconds`);

		this.sendCommand(`set PDU.OutletSystem.Outlet[${outlet}].${command} ${delay}\r\n`);
	}

	cycleOutlet(outlet) {
		let command = 'ToggleControl 1';

		this.log('info', `Cycling/Rebooting Outlet ${outlet}`);

		this.sendCommand(`set PDU.OutletSystem.Outlet[${outlet}].${command}\r\n`);
	}

	async sendCommand(cmd) {
		if (this.connectionReady) {
			this.log('debug', cmd);
			let res = await this.connection.exec(`${cmd}\r\n`);
		}
		else {
			this.log('warning', 'Connection not ready, unable to send command at this time.');
		}		
	}

	processResponse(response) {
		//process the response
		this.checkFeedbacks()
		this.checkVariables()
	}

	initPolling() {
		if (this.pollTimer === undefined && this.config.poll_interval > 0) {
			this.pollTimer = setInterval(() => {
				//send commands to get outlet data
			}, this.config.poll_interval)
		}
	}
}

runEntrypoint(moduleInstance, UpgradeScripts)
