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

		if (!(now.seconds() % 10)) {
			Log.log("isHidden: " + this.isHidden);  // This always shows as 0 ...
			Log.log((this.isHidden ? "Showing" : "Hiding") + " calender on " + now.seconds());
			if (this.DOMloaded) {
				MM.getModules().exceptModule(this).enumerate(function(module) {
					if (module.name === "calendar") {
						/* So this is weird ..., the console log always shows isHidden as 0,
						   yet, the next condition works as expected ... */
						if (this.isHidden) {
							module.show(2000, function() {
								// Module hidden.
								// this.isHidden = 0;  /* This doesn't set it either */
							});
							this.isHidden = 0;
						} else {
							module.hide(2000, function() {
								// Module hidden.
								// this.isHidden = 1;  /* This doesn't set it either */
							});
							this.isHidden = 1;
						}
					}
				});
			}
		}
		var wrapper = document.createElement("div");
		return wrapper;
	}
});
