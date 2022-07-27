import express from 'express'
import { login, verify } from '../controllers/authentication.js'
const router = express.Router()

router.get('/login', login)
router.get('/verify', verify)

export default router