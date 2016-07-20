Module.register("my_swap",{

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
			self.swapModules();
		}, 1000);
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			this.DOMloaded = 1;
		}
	},

	// Override dom generator.
	swapModules: function() {

		var now = moment();
		var self = this;

		if (!(now.seconds() % 10)) { // Update on the tens (00, 10, 20, 30, 40, and 50)
			if (this.DOMloaded) {

				if (self.isHidden) {
					MM.getModules().exceptModule(this).enumerate(function(module) {
						if (module.name === "clock") {
							module.hide(2000, function() {
								MM.getModules().exceptModule(this).enumerate(function(module) {
									if (module.name === "calendar") {
										module.show(2000, function() {
										});
									}
								});

							});
						}
					});
					self.isHidden = 0;
				} else {
					MM.getModules().exceptModule(this).enumerate(function(module) {
						if (module.name === "calendar") {
							module.hide(2000, function() {
								MM.getModules().exceptModule(this).enumerate(function(module) {
									if (module.name === "clock") {
										module.show(2000, function() {
										});
									}
								});

							});
						}
					});
					self.isHidden = 1;
				}
			}
		}
	}
});
