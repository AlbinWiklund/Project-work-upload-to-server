const sqlite = require('sqlite3')
const db = new sqlite.Database('albin.db')


db.run("PRAGMA foreign_keys = ON")

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectID INTEGER,
    description TEXT,
    hasReaction BOOLEAN,
    FOREIGN KEY (projectID) REFERENCES projects(id)
)`)

db.run(`
  CREATE TABLE IF NOT EXISTS imgURL (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT
)`)

db.run(` 
  CREATE TABLE IF NOT EXISTS reaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedbackID INTEGER,
    imgID INTEGER,
    FOREIGN KEY (feedbackID) REFERENCES feedback(id),
    FOREIGN KEY (imgID) REFERENCES imgURL(id)
  )`)

exports.selectAllFromProjects = function(callback){ 
    db.all("SELECT * FROM projects", function(error, projects){
        callback(error, projects)
    })
}

exports.selectFromProjectsWhereID = function(id, callback){
    const projectQuery = `SELECT * FROM projects WHERE projects.id = ?`
    const values = [id]

    db.get(projectQuery, values, function(error, project){
        callback(error, project)
    })
}

exports.selectReactionsAndFeedbackWhereID = function(id, callback){
    const reactionsAndFeedbackQuery = `
      SELECT feedback.id, imgURL.url, feedback.description FROM feedback
      JOIN reaction
      ON (feedback.id = reaction.feedbackID) OR (reaction.feedbackID = NULL)
      JOIN imgURL
      ON reaction.imgID = imgURL.id
      WHERE feedback.projectID = ?
    `
    const values = [id]

    db.all(reactionsAndFeedbackQuery, values, function(error, feedbackWithReactions){
        callback(error, feedbackWithReactions)
    })
}

exports.selectNoReactionFeedback = function(id, callback){
    const feedbackQuery = `
    SELECT * FROM feedback WHERE feedback.projectID = ? 
    AND hasReaction = FALSE`
    const values = [id]

    db.all(feedbackQuery, values, function(error, feedback){
        callback(error, feedback)
    })
}

exports.insertIntoProjects = function(title, description, callback){
    const query = "INSERT INTO projects (title, description) VALUES (?, ?)"
    const values = [title, description]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.updateProject = function(title, description, id, callback){
    const query = "UPDATE projects SET title = ?, description = ? WHERE id = ?"
    const values = [title, description, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.selectFeedbackWhereProjectID = function(projectID, callback){
    const selectFeedbackQuery = "SELECT feedback.id FROM feedback WHERE projectID = ?"
    const values = [projectID]

    db.all(selectFeedbackQuery, values, function(error, allFeedback){
        callback(error, allFeedback)
    })
}

exports.deleteReactionWhereFeedbackIDNoCB = function(id){
    const reactionQuery = "DELETE FROM reaction WHERE feedbackID = ?"
    const values = [id]

    db.run(reactionQuery, values)
}

exports.deleteReactionWhereFeedbackID = function(id, callback){
    const reactionQuery = "DELETE FROM reaction WHERE feedbackID = ?"
    const values = [id]

    db.run(reactionQuery, values, function(error){
        callback(error)
    })
}

exports.deleteFeedbackWhereProjectID = function(projectID, callback){
    const feedbackQuery = "DELETE FROM feedback WHERE projectID = ?"
    const values = [projectID]

    db.run(feedbackQuery, values, function(error){
        callback(error)
    })
}

exports.deleteProject = function(id, callback){
    const projectQuery = "DELETE FROM projects WHERE id = ?"
    const values = [id]

    db.run(projectQuery, values, function(error){
        callback(error)
    })
}

exports.selectTitleIDFromProject = function(callback){
    const query = "SELECT projects.id, projects.title FROM projects"

    db.all(query, function(error, projects){
        callback(error, projects)
    })
}

exports.selectFeedbackWhereID = function(id, callback){
    const feedbackQuery = "SELECT * FROM feedback WHERE id = ?"
    const values = [id]

    db.get(feedbackQuery, values, function(error, feedback){
        callback(error, feedback)
    })
}

exports.joinFeedbackProjectWhereProjectID = function(id, callback){
    const projectNameQuery = `
    SELECT projects.id, projects.title FROM projects JOIN feedback 
    ON feedback.projectID = projects.id 
    WHERE feedback.id = ?`
    const values = [id]

    db.get(projectNameQuery, values, function(error, projectTitle){
        callback(error, projectTitle)
    })
}

exports.updateFeedback = function(projectID, description, id, callback){
    const query = "UPDATE feedback SET projectID = ?, description = ? WHERE id = ?"
    const values = [projectID, description, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.insertIntoFeedback = function(id, description, callback){
    const query = "INSERT INTO feedback (projectID, description, hasReaction) VALUES (?, ?, false)"
    const values = [id, description]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteFeedbackWhereID = function(id, callback){
    const feedbackQuery = "DELETE FROM feedback WHERE id = ?"
    const values = [id]

    db.run(feedbackQuery, values, function(error){
        callback(error)
    })
}

exports.selectAllFromImg = function(callback){
    const query = "SELECT * FROM imgURL"

    db.all(query, function(error, images){
        callback(error, images)
    })
}

exports.updateReaction = function(imgID, feedbackID, callback){
    const reactionQuery = "UPDATE reaction SET imgID = ? WHERE feedbackID = ?"
    const values = [imgID, feedbackID]

    db.run(reactionQuery, values, function(error){
        callback(error)
    })
}

exports.setReactionOnFeedback = function(id, callback){
    const feedbackQuery = "UPDATE feedback SET hasReaction = true WHERE id = ?"
    const values = [id]

    db.run(feedbackQuery, values, function(error){
        callback(error)
    })
}

exports.removeReactionOnFeedback = function(feedbackID, callback){
    const feedbackQuery = "UPDATE feedback SET hasReaction = false WHERE id = ?"
    const values = [feedbackID]

    db.run(feedbackQuery, values, function(error){
        callback(error)
    })
}

exports.insertIntoReaction = function(feedbackID, imgID, callback){
    const reactionQuery = "INSERT INTO reaction (feedbackID, imgID) VALUES (?, ?)"
    const values = [feedbackID, imgID]

    db.run(reactionQuery, values, function(error){
        callback(error)
    })
}


