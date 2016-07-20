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
		var self = this;

		this.isHidden = 0;

		setInterval(function() {
			self.showHideModule();
		}, 1000);

	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			this.DOMloaded = 1;
		}
	},

	showHideModule() {
		var self = this;
		var now = moment();
		
		if (!(now.seconds() % 20)) { // fade in/out on 00, 20, and 40 seconds.
			if (this.DOMloaded) {
				MM.getModules().exceptModule(this).enumerate(function(module) {
					if (module.name === "calendar_monthly") {
						if (self.isHidden) {
							module.show(2000, function() {
								// Module hidden.
							});
							self.isHidden = 0;
						} else {
							module.hide(2000, function() {
								// Module hidden.
							});
							self.isHidden = 1;
						}
					}
				});
			}
		}
	}
});
