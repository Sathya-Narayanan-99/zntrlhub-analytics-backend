import express, { json } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.use("*", (req, res) => res.status(404).json({detail: "Not found."}))

export default app