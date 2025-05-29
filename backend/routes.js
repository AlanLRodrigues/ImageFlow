const upload = require('./Config/Multer')
const express = require("express")
const router = express.Router()

const LoginController = require('./Controller/ControllerLogin')
const SignUpController = require('./Controller/ControllerSignUp')
const UploadController = require('./Controller/ControllerUpload')
const ImageController = require('./Controller/ControllerImages')
const ValidateSignUp = require('./Middleware/ValidateSignUp')
const Logout = require('./Controller/ControllerLogout')
const Authenticate = require('./Middleware/Auth')

router.post('/upload', Authenticate, upload.single('file'), UploadController.UploadImg)
router.post('/signup', ValidateSignUp, SignUpController.SignUp)
router.post('/login', LoginController.Login)

router.get('/images', Authenticate, ImageController.ShowImg)
router.get('/logout', Logout.Logout)

router.delete('/images/:id', Authenticate, ImageController.DeleteImg)

module.exports = router