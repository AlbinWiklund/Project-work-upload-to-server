const express = require('express')
const router = express.Router()
const validators = require('../validators')
const db = require('../database')

router.get('/:id/delete', function (req, res) {
	const feedbackID = req.params.id

	const model = {
		feedbackID,
		name: "Delete comment"
	}

	res.render('feedback-delete.hbs', model)
})

router.get('/:id/update', function (req, res) {
	const id = req.params.id
	
	db.selectTitleIDFromProject(function (error, projects) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error', model)
		} else {
			db.selectFeedbackWhereID(id, function (error, feedback) {
				if (error) {
					const model = {
						hasDatabaseError: true,
						name: "Server Error"
					}
					res.render('server-error.hbs', model)
				} else {
					db.joinFeedbackProjectWhereProjectID(id, function (error, projectTitle) {
						if (error) {
							const model = {
								hasDatabaseError: true,
								name: "Server Error"
							}
							res.render('server-error.hbs', model)
						} else {
							const model = {
								hasDatabaseError: false,
								projects,
								feedback,
								projectTitle,
								name: "Update feedback"
							}
							res.render('feedback-update.hbs', model)
						}
					})
				}
			})
		}

	})
})

router.get('/', function (req, res) {

	db.selectAllFromProjects(function (error, project) {

		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error.hbs', model)
		} else {
			const model = {
				hasDatabaseError: false,
				project,
				name: "Feedback"
			}
			res.render('feedback.hbs', model)
		}

	})

})

router.post('/update', function (req, res) {
	const projectID = req.body.projectSelect
	const description = req.body.description
	const id = req.body.feedbackID

	const validationErrors = validators.getValidationErrorForFeedback(projectID, description)
	if (req.session.isLoggedIn != true) {
		validationErrors.push("You are not logged in!")
	}

	if (validationErrors.length == 0) {
		db.updateFeedback(projectID, description, id, function (error) {
			if (error) {
				const model = {
					hasDatabaseError: true,
					name: "Server Error"
				}
				res.render('server-error.hbs', model)
			} else {
				res.redirect('/projects/' + projectID)
			}
		})
	} else {

		db.selectTitleIDFromProject(function (error, projects) {

			if (error) {

				const model = {
					hasDatabaseError: true,
					name: "Server Error"
				}
				res.render('server-error', model)
			} else {
				db.joinFeedbackProjectWhereProjectID(id, function (error, projectTitle) {
					if (error) {
						const model = {
							hasDatabaseError: true,
							name: "Server Error"
						}
						res.render('server-error.hbs', model)
					} else {
						const model = {
							projectTitle,
							description,
							projects,
							id,
							validationErrors,
							name: "Update feedback"
						}
						res.render('feedback-update.hbs', model)
					}
				})
			}
		})
	}
})

router.post('/', function (req, res) {
	const id = req.body.projectSelect
	const description = req.body.description
	const checkLogIn = req.session.isLoggedIn

	const validationErrors = validators.getValidationErrorForFeedback(id, description)

	if (validationErrors.length == 0) {
		db.insertIntoFeedback(id, description, function (error) {
			if (error) {
				const model = {
					hasDatabaseError: true,
					name: "Server ErrorK"
				}
				res.render('server-error.hbs', model)
			} else {
				res.redirect('/projects/' + id)
			}
		})
	} else {
		db.selectAllFromProjects(function (error, project) {

			if (error) {
				const model = {
					hasDatabaseError: true,
					name: "Server Error"
				}
				res.render('server-error.hbs', model)
			} else {
				const model = {
					hasDatabaseError: false,
					validationErrors,
					project,
					name: "Feedback"
				}
				res.render('feedback.hbs', model)
			}

		})
	}
})

router.post('/delete', function (req, res) {
	const feedbackID = req.body.feedbackID

	if (req.session.isLoggedIn != true) {
		const model = {
			feedbackID,
			name: "Delete feedback"
		}
		res.render('feedback-delete.hbs')
	} else {
		db.deleteReactionWhereFeedbackID(feedbackID, function (error) {
			if (error) {
				const model = {
					hasDatabaseError: true,
					name: "Server Error1"
				}
				res.render('server-error.hbs', model)
			} else {
				db.deleteFeedbackWhereID(feedbackID, function (error) {
					if (error) {
						const model = {
							hasDatabaseError: true,
							name: "Server Error2"
						}
						res.render('server-error.hbs', model)
					} else {
						res.redirect('/projects')
					}
				})
			}
		})
	}
})

module.exports = router