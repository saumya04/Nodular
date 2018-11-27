module.exports = {

	// transformer param key
	transformer: {
		paramKey: 'includes'
	},

	// pagination settings
	pagination: {
		limit: {
			default: 20,
			max: 100
		}
	},

	// database notifications
	database_notifications: {
		types: {
			SomeTaskDone: {
				type: 1,
				className: 'SomeTaskDone',
				title: 'A task has been done',
				message: `The 'A' Task has been completed successfully`,
			},
		}
	},

	resetPassword: {
		expiryTime: 24
	},
	
	// ...

}
