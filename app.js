const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
const path = require('path')
const csurfToken = require('csurf')
const cookieParser = require('cookie-parser')

const app = express()
const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)
app.use(express.urlencoded( {extended: false}))
app.use(express.json())

const authRouter = require('./routers/auth-router.js')
const projectRouter = require('./routers/project-router')
const feedbackRouter = require('./routers/feedback-router')
const reactionRouter = require('./routers/reaction-router')

app.use('/static', express.static("public"))

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: path.resolve(__dirname, 'views', 'layouts'),
  partialsDir: path.resolve(__dirname, 'views', 'partials')
}))

  app.use(cookieParser())
  app.use(csurfToken({cookie: true}))

  app.use(expressSession({
    store: new SQLiteStore({db: "session-db.db"}),
    secret: "fhjdsfhkashk675332kjnks",
    saveUninitialized: false,
    resave: false
  }))

  app.use(function(req, res, next){
    res.locals.csurfToken = req.csrfToken()
    next()
  })

  app.use(function(req, res, next){
    res.locals.session = req.session
    next()
  })


  app.get('/', function(req, res){
    const model = {
      name: "Start"
    }
    res.render('start.hbs', model)
  })

  app.post('/logout', function(req, res){
    if(req.session) {
        req.session.destroy()
    }
    res.redirect('/login')
})

  app.use('/login', authRouter)
  app.use('/projects/feedback/reaction', reactionRouter)
  app.use('/projects/feedback', feedbackRouter)
  app.use('/projects', projectRouter)

app.get('/contact', function(req, res){
  const model = {
    name: "Contact"
  }
  res.render('contact.hbs', model)
})

app.listen(8080)