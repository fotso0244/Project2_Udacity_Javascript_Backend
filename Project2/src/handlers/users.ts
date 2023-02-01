import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode';
import cors from 'cors'

const store = new UserStore()
let user: User = { 
    password_digest: "",
    firstname: "",
    lastname: ""
}

const index = async (_req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
  }

  const show = async (_req: Request, res: Response) => {
    const user = await store.show(_req.params.id)
    if (user != null) {
        res.json(user)
        return
    }
    else {
        res.status(405)
    }
  }

const create = async (_req: Request, res: Response) => {
    try {
        user = {
            password_digest: _req.body.password_digest,
            lastname: _req.body.lastname,
            firstname: _req.body.firstname,
        }

        const newUser = await store.create(user)
        var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
        res.json(token)
    } catch(err) {
        res.status(400)
        res.json(err as string + user)
    }
}

const update = async (_req: Request, res: Response) => {
    let id: string = '0'
    try {
        id = _req.params.id
        const password_digest = _req.body.password_digest

        const updateUser = await store.update(+id, password_digest)
    
        res.json(updateUser)
    } catch(err) {
        res.status(400)
        res.json(err as string + id)
    }
}

const authenticate = async (_req: Request, res: Response) => {
    try {
        const user: User = {
            password_digest: _req.body.password_digest,
            lastname: _req.body.lastname,
            firstname: _req.body.firstname,
        }
        const userCheck = await store.authenticate(user)
        if (userCheck != null) {
            var token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);
            res.json(token)
            //res.status(200).send('Authentification success')
        }
        res.status(403).send('Authentification failed')    
    } catch(err) {
        res.status(401)
        res.json({ err })
    }
}

const verifyAuthToken = async (req: Request, res: Response, next: any) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader?.split(' ')[1] as string
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)
        const decodedToken: any = jwt_decode(token)
        const retrLastname = await store.getLastname(decodedToken.user.lastname)
        const retrFirstname = await store.getFirstname(decodedToken.user.firstname)
        console.log(retrLastname)
        console.log(retrFirstname)
        if (!retrLastname || !retrFirstname) {
            res.status(403).send('Authentification failed')
            return
        }
        res.locals.user = jwt_decode(token)
        
        next()
    } catch (error) {
        res.status(401)
        res.json({ error})
    }
}

const checkid = async (req: Request, res: Response, next: any) => {
    let id: string = '0'
    try {
        id = req.params.id
        const lastname = res.locals.user.user.lastname
        const firstname = res.locals.user.user.firstname
        
        const matchId = await store.checkid(lastname, firstname)
        if (+id == matchId) { 
            next()
        }
        else { 
            res.status(403).send(`Id ${id} does not match your id, please use your Id - ${matchId}`)
        }
    } catch(err) {
        res.status(400)
        res.json(err as string + id)
    }
}
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,// For legacy browser support
    methods: "GET"
  }
const userRoutes = (app: express.Application) => {
    app.get('/users/list', cors(corsOptions), index)
    app.get('/users', cors(corsOptions), authenticate)
    app.post('/users', cors({
        origin: '*',
        optionsSuccessStatus: 200,// For legacy browser support
        methods: "POST"
      }), create)
    app.put('/users/:id', cors({
        origin: '*',
        optionsSuccessStatus: 200,// For legacy browser support
        methods: "PUT"
      }), verifyAuthToken, checkid, update)
      app.get('/users/:id', cors(corsOptions), show)
  }
  
  export default userRoutes