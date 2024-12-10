import express from 'express'
import bcrypt from 'bcrypt'
import { dbQuery, initializeDB, dbRun } from './database.js'

const app = express()
app.use(express.json())

app.get('/users', async (req, res, next) => {
    try {
        const users = await dbQuery("SELECT * FROM users;");
        res.status(200).json({ 
			status: 'success',
			message: 'Users list',
			users: users
		});
    } catch (err) {
        next(err);
    }
})

app.post('/users', async (req, res, next) => {
	if (!req.body.name || !req.body.password) {
		return res.status(400).json({ 
			status: 'fail',
			message: 'Name and password are required'
		})
	}
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const result = await dbRun("INSERT INTO users (name, password) VALUES (?, ?);", [req.body.name, hashedPassword]);
		res.status(201).json({ 
			status: 'success',
			message: 'User created'
		})
	} catch (err) {
        next(err);
	}
})

app.post('/users/login', async (req, res, next) => {
	if (!req.body.name || !req.body.password) {
		return res.status(400).json({ 
			status: 'fail',
			message: 'Name and password are required'
		})
	} 
	try {
		const [ user ] = await dbQuery("SELECT * FROM users WHERE name = ?;", [req.body.name])
		if (!user) {
			return res.status(404).json({ 
				status: 'fail',
				message: 'Invalid credentials'
			})
		}
		if (!await bcrypt.compare(req.body.password, user.password)) {
			res.status(401).json({ 
				status: 'fail',
				message: 'Not Allowed'
			})
		}
		return res.status(200).json({ 
			status: 'success',
			message: 'Login successful'
		})
	} catch (err) {
		next(err);
	}
})

app.use((err, req, res, next) => {
	res.status(500).json({ error: `Internal Server Error: ${err.message}` })
})

const startServer = async () => {
    await initializeDB();
    app.listen(3000, () => console.log("Server is running on port 3000"));
};

startServer();