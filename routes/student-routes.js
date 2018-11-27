const StudentsController = require('../app/http/controllers/api/v1/StudentsController')
const studentsPrefix = 'students'
let commonMiddleware = [
	'auth.jwt', // to check if token exists and is valid
	'hasRole:student', // to check if the user has specified role; can take mutliple arguments to check multiple roles
	'policy.student.checkForAuthenticTokenRoute', // to add the student object in req.meta
]

module.exports = {

	// ########################################
	// Students Routes
	// ########################################

	[`GET ${studentsPrefix}/:studentUserId`]: {
		action: StudentsController.get,
		name: 'api.students.get',
		middlewares: [
			...commonMiddleware,
			// Can use more specific middleware/policies here...
		]
	},

}
