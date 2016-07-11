/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("my_hide",{

	// Default module config.
	defaults: {
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	start: function() {
		Log.log("Starting module: " + this.name);
		this.DOMloaded = 0;
		this.isHidden = 0;

		var self = this;
		setInterval(function() {
			self.updateDom();
		}, 1000);

	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			this.DOMloaded = 1;
		}
	},

	// Override dom generator.
	getDom: function() {

		var now = moment();
		Log.log("DOM loaded? : " + this.DOMloaded);

		if (!(now.seconds() % 10)) {
			Log.log("isHidden: " + this.isHidden);
			Log.log((this.isHidden ? "Showing" : "Hiding") + " calender on " + now.seconds());
			if (this.DOMloaded) {
				MM.getModules().exceptModule(this).enumerate(function(module) {
					if (module.name === "calendar_monthly") {
						if (this.isHidden) {
							module.show(3000, function() {
								//Module hidden.
//								this.isHidden = 0;
							});
							this.isHidden = 0;
						} else {
							this.isHidden = 1;
							module.hide(3000, function() {
								//Module hidden.
//								this.isHidden = 1;
							});
							this.isHidden = 1;
						}
					}
				});
			}
		}
	}
});