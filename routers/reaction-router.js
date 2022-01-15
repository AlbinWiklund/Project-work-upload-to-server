const express = require('express')
const router = express.Router()
const db = require('../database')



router.get('/:id/update', function (req, res) {
	const feedbackID = req.params.id
	const feedbackQuery = "SELECT * FROM feedback WHERE feedback.id = ?"
	const values = [feedbackID]

	db.selectFeedbackWhereID(feedbackID, function (error, feedback) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error2"
			}
			res.render('server-error.hbs', model)
		} else {
			db.selectAllFromImg(function (error, images) {
				if (error) {
					const model = {
						hasDatabaseError: true,
						name: "Server Error1"
					}
					res.render('server-error.hbs', model)
				}
				else {
					const model = {
						hasDatabaseError: false,
						images,
						feedback,
						name: "Change reaction"
					}
					res.render('reaction-change.hbs', model)
				}
			})
		}
	})
})

router.get('/:id/delete', function (req, res) {
	const feedbackID = req.params.id

	const model = {
		feedbackID,
		name: "Delete reaction"
	}
	res.render('reaction-delete.hbs', model)
})

router.get('/:id', function (req, res) {
	const feedbackID = req.params.id

	db.selectFeedbackWhereID(feedbackID, function (error, feedback) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error.hbs', model)
		} else {
			db.selectAllFromImg(function (error, images) {
				if (error) {
					const model = {
						hasDatabaseError: true,
						name: "Server Error"
					}
					res.render('server-error.hbs', model)
				}
				else {
					const model = {
						hasDatabaseError: false,
						images,
						feedback,
						name: "Reactions"
					}
					res.render('reaction.hbs', model)
				}
			})
		}
	})
})

router.post('/update', function (req, res) {
	const feedbackID = req.body.feedbackID
	const imgID = req.body.imgID

	db.updateReaction(imgID, feedbackID, function (error) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error.hbs', model)
		} else {
			res.redirect('/projects/')
		}
	})
})

router.post('/', function (req, res) {

	const feedbackID = req.body.feedbackID
	const imgID = req.body.imgID

	db.setReactionOnFeedback(feedbackID, function (error) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error.hbs', model)
		} else {
			db.insertIntoReaction(feedbackID, imgID, function (error) {
				if (error) {
					const model = {
						hasDatabaseError: true,
						name: "Server Error"
					}
					res.render('server-error.hbs', model)
				} else {
					res.redirect('/projects')
				}
			})
		}
	})
})

router.post('/delete', function (req, res) {
	const feedbackID = req.body.feedbackID

	db.removeReactionOnFeedback(feedbackID, function (error) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				name: "Server Error"
			}
			res.render('server-error.hbs', model)
		} else {
			db.deleteReactionWhereFeedbackID(feedbackID, function (error) {
				if (error) {
					const model = {
						hasDatabaseError: true,
						name: "Server Error"
					}
					res.render('server-error.hbs', model)
				} else {
					res.redirect('/projects')
				}
			})
		}
	})
})

module.exports = router