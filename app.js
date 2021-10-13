const express=require('express')
const dotenv=require('dotenv')
const cookieParser=require('cookie-parser')

const app=express()

//seteamos el motor de plantillas
app.set('view engine','ejs')

//seteamos la carpeta publica para archivos estaticos
app.use(express.static('public'))

//procesar datosenviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables de entorno

dotenv.config({path:'./env/.env'})

//trabajar con las cookies
app.use(cookieParser())
//llamar al router
app.use('/',require('./routers/router'))


app.listen(3000,()=>{

    console.log('SERVER UP running in http://localhost:3000')


})