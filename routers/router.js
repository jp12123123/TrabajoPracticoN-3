const express=require('express')
const router=express.Router()


const aurhController= require('../controllers/authContoller')
//router para las vistas
router.get('/',aurhController.isAuthenticated,(req,res)=>{//autenticacion con el token
   
    res.render('index', {user:req.user})
    
    })
//login
    router.get('/login',(req,res)=>{

        res.render('login',{alert:false})
        
        })

        //registro
    router.get('/register',(req,res)=>{

        res.render('register')
        
        })


//router para las metodos del controller
     router.post('/register',aurhController.register)
     router.post('/login',aurhController.login)
     router.get('/logout',aurhController.logout)
    module.exports=router

   