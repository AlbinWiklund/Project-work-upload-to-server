const express = require('express')
const validators = require('../validators')
const db = require('../database')
const router = express.Router()

router.get('/', function(req, res){

    db.selectAllFromProjects(function(error, projects){
  
        if(error){
            const model = {
                hasDatabaseError: true,
                name: "Server Error"
            }
            res.render('server-error.hbs', model)
        }else{
            const model = {
                hasDatabaseError: false,
                projects,
                name: "Projects"
            }
            res.render('projects.hbs', model)
        }	

    })

})
  
router.get('/new', function(req, res){
    const model = {
      name: "New project"
    }
    res.render('projects-new.hbs', model)
})
  
router.get('/:id', function(req, res){
    
    const id = req.params.id
  
    db.selectFromProjectsWhereID(id, function(error, project){
      if(error){
        const model = {
          hasDatabaseError: true,
          name: "Server Error"
        }
        res.render('server-error.hbs', model)
      }else{ 
        db.selectReactionsAndFeedbackWhereID(id, function(error, feedbackWithReactions){
          if(error){
            const model = {
              hasDatabaseError: true,
              name: "Server Error"
            }
            res.render('server-error.hbs', model)
          }else{ 
            db.selectNoReactionFeedback(id, function(error, feedback){
              
              if(error){
                const model = {
                  hasDatabaseError: true,
                  name: "Server Error"
                }
                res.render('server-error.hbs', model)
              }else{
                const model = {
                  project,
                  feedback,
                  feedbackWithReactions,
                  name: "Project"
                }
                res.render('project.hbs', model)
              }
            })
          }
        })
      }
    })
      
})
  
router.get('/:id/update', function(req, res){
    const id = req.params.id
    
    db.selectFromProjectsWhereID(id, function(error, project){
  
      if(error){
        const model = {
          hasDatabaseError: true,
          name: "Server Error"
        }
        res.render('server-error.hbs', model)
      }else{
        const model = {
          project,
          name: project.title
        }
        res.render('projects-update.hbs', model)
      }
    })
})

router.get('/:id/delete', function(req, res){
    const projectID = req.params.id

  const model = {
    projectID,
    name: "Delete project"
  }

  res.render('project-delete.hbs', model)
})
  
  
router.post('/new', function(req, res){
    const title = req.body.title
    const description = req.body.description
    
    const validationErrors = validators.getValidationErrorForProject(title, description)
    
    if(validationErrors.length == 0) {
      db.insertIntoProjects(title, description, function(error){
        if(error){
          const model = {
            hasDatabaseError: true,
            name: "Server Error"
          }
          res.render('server-error.hbs', model)
        }else{
          res.redirect('/projects')
        }
      })
    }else{
      const model = {
        title,
        description,
        validationErrors,
        name: "New project"
      }
      res.render('projects-new.hbs', model)
    }
})
  
router.post('/update', function(req, res){
    const title = req.body.title
    const description = req.body.description
    const id = req.body.id
    
    const validationErrors = validators.getValidationErrorForProject(title, description)
    
    if(validationErrors.length == 0) {
      db.updateProject(title, description, id, function(error){
        if(error){
          const model = {
            hasDatabaseError: true,
            name: "Server Error"
          }
          res.render('server-error.hbs', model)
        }else{ 
          res.redirect('/projects')
        }
      })
    }else{
      const model = {
        validationErrors,
        description,
        name: title,
        title,
        id
      }
      res.render('projects-update.hbs', model)
    }
})
  
  
router.post('/delete', function(req, res){
    const projectID = req.body.projectID
  
    db.selectFeedbackWhereProjectID(projectID, function(error, allFeedback){
      
      for(let feedbackID of allFeedback) {
        const reactionValue = [feedbackID.id]
        db.deleteReactionWhereFeedbackIDNoCB(reactionValue)
      }
      db.deleteFeedbackWhereProjectID(projectID, function(error){
        if(error){
          const model = {
            hasDatabaseError: true,
            name: "Server Error"
          }
          res.render('server-error.hbs', model)
        }else{ 
          db.deleteProject(projectID, function(error){
            if(error){
              const model = {
                hasDatabaseError: true,
                name: "Server Error"
              }
              res.render('server-error.hbs', model)
            }else{  
              res.redirect('/projects')
            }
          })
        }
      })
    })
})

module.exports = router