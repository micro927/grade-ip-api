import express from 'express'
import { createMainListTable } from '../controllers/prepare.js'
const router = express.Router()

router.get('/createmainlisttable', createMainListTable)

export default router