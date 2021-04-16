const { User, Message } = require('../models/models.js')
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const router = Router()

router.get('/', async function (req, res){
    let messages = await Message.findAll({})
    let data = { messages }

    res.render('index.ejs', data)
})

router.get('/createUser', async function(req, res){
    res.render('createUser.ejs')
})

router.post('/createUser', async function(req, res){
    let { username, password } = req.body

    try {
        let user = await User.create({
            username,
            password,
            role: "user"
        })  

        console.log(user)

        if (user.username===user.username && user.password===user.password){
            res.redirect('/login')
            
        } else 
            res.render('error.ejs')

    } catch (e) {
        console.log(e)
    }

    
})

router.get('/login', function(req, res) {
    res.render('login')
})
router.get('/logout', function(req, res) {
    res.render('logout')
})

router.post('/login', async function(req, res) {
    try {
    let {username, password} = req.body

    let whereUser = {
        username: username,
        password: password,
      };

      console.log("log in req.body", req.body)

        let user = await User.findOne({
            where: whereUser
        })

    if (user.username===user.username && user.password===user.password) {
        let data = {
            username: username,
            password: password,
            role: user.role
        }

            console.log(user)

        let token = jwt.sign(data, "theSecret")
            res.cookie("token", token)
            res.redirect('/')

            console.log(token)
    } else if (user.username!==user.username && user.password!==user.password){
            res.render('error')
    }

    } catch (e) {
        console.log(e)
    }
    
})

router.get('/message', async function (req, res) {
    let token = req.cookies.token 

    if (token) {                                      // very bad, no verify, don't do this
        res.render('message')
    } else {
        res.render('login')
    }
})

router.post('/logout', function(req, res){
    try{
    let token = req.body.cookies;
    
    (async () =>{
    await User.destroy({
        where: {
            username : token         
        }
    })
    })()

    res.cookie('token',token, { 
        expires: new Date(Date.now()),
        httpOnly: true 
    })

    res.redirect('createUser')
}catch(e){
    console.log(e)

}
      
    
})

router.post('/message', async function(req, res){
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")  
 
        let user = await User.findOne({
            where: {username: payload.username}
        })

        let msg = await Message.create({
            content,
            userId: user.id
        })

        res.redirect('/')
        console.log(user)
    } else {
        res.redirect('/login')
    }
})

router.get('/error', function(req, res){
    res.render('error')
})

router.all('*', function(req, res){
    res.send('404 dude')
})

module.exports = router