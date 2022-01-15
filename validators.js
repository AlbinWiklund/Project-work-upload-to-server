const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '$2b$10$PatAqIs5e3PF47J3FubaduRNEgj1H/yruxc.cmS.xqbPgSYH5ZnRe'

exports.getValidationErrorForLogin = function (username, checkPassword) { 
	
	const validationErrors = []

	if (username != ADMIN_USERNAME) {
		validationErrors.push("Wrong username")
	}
	if (checkPassword != true) {
		validationErrors.push("Wrong password")
	}
	return validationErrors;
}

exports.getValidationErrorForFeedback = function (projectID, description) {

	const validationErrors = []
	const DESCRIPTION_MIN_LENGTH = 10
	const DESCRIPTION_MAX_LENGTH = 150

	if (projectID == "") {
		validationErrors.push("You need to chose a project")
	}
	if (description.length < DESCRIPTION_MIN_LENGTH) {
		validationErrors.push("The description needs to be atleast " + DESCRIPTION_MIN_LENGTH + " characters long!")
	} else if (description.length > DESCRIPTION_MAX_LENGTH) {
		validationErrors.push("The description can't be longer than " + DESCRIPTION_MAX_LENGTH + " characters")
	}
	return validationErrors
}

exports.getValidationErrorForProject = function (title, description, checkLogIn) {

	const validationErrors = []
	const TITLE_MIN_LENGTH = 5
	const TITLE_MAX_LENGTH = 50
	const DESCRIPTION_MIN_LENGTH = 15
	const DESCRIPTION_MAX_LENGTH = 150

	if(checkLogIn != true) {
		validationErrors.push("You are not logged in!")
	}
	if (title.length < TITLE_MIN_LENGTH) {
		validationErrors.push("The title needs to be atleast " + TITLE_MIN_LENGTH + " characters long")
	} if (title.length > TITLE_MAX_LENGTH) {
		validationErrors.push("The title can't be longer than " + TITLE_MAX_LENGTH + " charcters")
	}
	if (description.length < DESCRIPTION_MIN_LENGTH) {
		validationErrors.push("The feedback needs to be atleast " + DESCRIPTION_MIN_LENGTH + " characters long")
	} else if (description.length > DESCRIPTION_MAX_LENGTH) {
		validationErrors.push("The feedback can't be longer than " + DESCRIPTION_MAX_LENGTH + " characters")
	}
	return validationErrors
}