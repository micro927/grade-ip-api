import express from 'express'
import getStudentStatusList from '../controllers/authentication/prepare.js'
const router = express.Router()

router.get('/', (req, res) => res.status(400).json('HELLO MARS'))

export default router