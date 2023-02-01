import { ProductStore, Product } from "../models/product"
import { UserStore } from "../models/user"
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import jwt_decode from 'jwt-decode';

const store = new ProductStore()
const store2 = new UserStore()
const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
  }
  
  const show = async (req: Request, res: Response) => {
     const product = await store.show(req.params.productid)
     if (product != null) {
        res.json(product)
     }
     else {
        res.status(404)
     }
  }

  const mostPopularProducts = async (req: Request, res: Response) => {
    const products = await store.mostPopularProducts()
    res.json(products)
 }

 const productsByCategory = async (req: Request, res: Response) => {
    const products = await store.productsByCategory(req.params.category)
    if (products == null) {
        res.status(404)
    }
    res.json(products)
 }

  const create = async (_req: Request, res: Response) => {
    try {
        let category = _req.body.category
        if (!category) {
            category = 'None'
        }
        const product: Product = {
            name_prod: _req.body.name_prod,
            price: _req.body.price,
            category: category
            
        }

        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const verifyAuthToken = async (req: Request, res: Response, next: any) => {
  try {
      const authorizationHeader = req.headers.authorization
      const token: string = authorizationHeader?.split(' ')[1] as string
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)
      const decodedToken: any = jwt_decode(token)
      const retrLastname = await store2.getLastname(decodedToken.user.lastname)
      const retrFirstname = await store2.getFirstname(decodedToken.user.firstname)
        console.log(retrLastname )
        console.log(retrFirstname )
      if (!retrLastname || !retrFirstname) {
            res.status(403).send('Authentification failed')
            return
        }

      next()
  } catch (error) {
      res.status(401)
      res.json({ error})
  }
}
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,// For legacy browser support
    methods: "GET"
  }
const productRoutes = (app: express.Application) => {
    app.get('/products', cors(corsOptions), index)
    app.get('/products/:productid', cors(corsOptions), show)
    app.post('/products', cors({
        origin: '*',
        optionsSuccessStatus: 200,// For legacy browser support
        methods: "POST"
      }), verifyAuthToken, create)
    app.get('/most-popular-products', cors(corsOptions), mostPopularProducts)
    app.get('/products-by-category/:category', cors(corsOptions), productsByCategory)
}
export default productRoutes