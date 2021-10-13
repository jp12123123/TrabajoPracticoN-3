const jwt = require ('jsonwebtoken') 
const bcryptjs=require('bcryptjs')
const conexion=require('../database/db')
const {promisify} = require('util')
//const { use } = require('../routers/router')

//procedimiento para registrarnos
exports.register = async(req,res)=>{
try{

  
    const name= req.body.name
    const user= req.body.user
    const pass= req.body.pass
 //console.log(name+" - " +user+" - "+ pass) mensaje por consola
 let passHash=await bcryptjs.hash(pass, 8)//devuelve la pass codificada
 //console.log(passHash)
    conexion.query('INSERT INTO users SET ?',{user:user,name:name,pass:passHash},(error,results)=>{
      if(error){console.log(console.error)}
      res.redirect('/')
    })

}catch(error){

    console.log(error)

}
}

//login

exports.login = async (req, res)=>{
   try{
      const user= req.body.user
      const pass= req.body.pass
      console.log(user + "-"+pass)
      if(!user || !pass){
            res.render('login',{
               alert:true,
               alertTitle:"Advertencia",
               alertMessage:"Ingrese un usuario y contraseña",
               alertIcon:'info',
               showConfirmButton:true,
               timer:false,
               ruta:'login'
             

            })

      }else{
        conexion.query('SELECT * FROM users WHERE user = ?',[user],async(error,results)=>{
               if(results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                  alert:true,
                  alertTitle:"Error",
                  alertMessage:"Usuario y contraseña incorrecto",
                  alertIcon:'error',
                  showConfirmButton:true,
                  timer:false,
                  ruta:'login'
                
   
               }) 

               }else{
                 //inicio de sesion ok
                 //crear token
                const id=results[0].id
                const token=jwt.sign({id:id},process.env.JWT_SECRETO,{
                     expiresIn:process.env.JWT_TIEMPO_EXPIRA

                })
                console.log("TOKEN: "+token+" para el usuario: "+user)

                const cookiesOptions = {
                  expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                  httpOnly:true
                }
                res.cookie('jwt',token,cookiesOptions)
                res.render('login',{
                  alert:true,
                  alertTitle:"Conexion exitosa",
                  alertMessage:"!Login correcto!",
                  alertIcon:'success',
                  showConfirmButton:false,
                  timer:800,
                  ruta:''

                })
               }

        })

      }
   }catch(error){
     console.log(error)

   }


}

exports.isAuthenticated=async(req,res,next)=>{

  if(req.cookies.jwt){
    try{
        const decodificada=await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
        //consulta para chequear  si el usuario esta en la base de datis
        conexion.query('SELECT * FROM users WHERE id = ?',[decodificada.id],(error,results)=>{
          //los resultados que no tienen valor
          if(!results){return next()}
          req.user = results[0]
          return next()

        })

    }catch(error){

             console.log(error)
             return next()
    }

 

  }else{
    //si no cumple lo anterio se dirige al login
    res.redirect('/login')
    

  }
        



}
//eliminamos la cookie
exports.logout=(req,res)=>{
   res.clearCookie('jwt')
   return res.redirect('/')

}