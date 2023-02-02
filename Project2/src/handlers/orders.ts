import { OrderStore, OrderProduct, Order } from "../models/order"
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import jwt_decode from 'jwt-decode';
import { UserStore } from "../models/user";

const store = new OrderStore()
const store2 = new UserStore()
const index = async (_req: Request, res: Response) => {
    const orders = await store.index()
    res.json(orders)
  }
  
  const show = async (req: Request, res: Response) => {
     const order = await store.show(req.params.id)
     res.json(order)
  }

  const currentOrderByUser = async (req: Request, res: Response) => {
    const orderid = await store.currentOrderByUser(req.params.userid)
    res.json(orderid)
 }

 const completedOrdersByUser = async (req: Request, res: Response) => {
  const orderid = await store.completedOrdersByUser(req.params.userid)
  res.json(orderid)
}
const createOrder = async (req: Request, res: Response)=> {
  const newOrder = {
    order_id: req.params.orderid,
    user_id: req.params.id,
    status: 'active'
  }
  const order = await store.create_order(newOrder)
  res.json(order)
}
const updateStatus = async (req: Request, res: Response) => {
  if (!await store.show(req.params.orderid)) {
    res.status(401).send(`order ${req.params.orderid} does not exist`)
      return
  }
  if (req.body.status != 'complete') {
    res.status(401).send('Status of an order can only change to complete')
      return
  }
  const order = await store.updateStatus(req.params.orderid, req.body.status)
  res.json(order)
}

const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.orderid
  const userId: string = _req.params.id
  const productId: string = _req.body.product_id
  const status: string = _req.body.status
  const quantity: number = parseInt(_req.body.quantity)
  const newOrderProduct: OrderProduct = {
    order_id: orderId,
    product_id: productId,
    quantity: quantity,
    //user_id: userId,
    //status: status
  }
  const newOrder: Order = {
    order_id: orderId,
    user_id: userId,
    status: status
  }

  try {
    const addedProduct = await store.addProduct(newOrderProduct, newOrder)
    if (addedProduct.order_id=='') {
      res.status(401).send(`product ${addedProduct.product_id} does not exist`)
      return
    }
    if ((addedProduct.product_id=='')) {
      res.status(401).send(`Cannot add product ${productId} to order ${orderId}, because this order status is complete`)
      return
    }
    if ((addedProduct.product_id=='') && (addedProduct.order_id=='')) {
      res.status(401).send(`user ${userId} does not exist`)
      return
    }
    res.json(addedProduct)
  } catch(err) {
    res.status(400)
    res.json(err)
  }
} 
const checkid = async (req: Request, res: Response, next: any) => {
  let id: string = '0'
  try {
      id = req.params.id
      const lastname = res.locals.user.user.lastname
      const firstname = res.locals.user.user.firstname
      
      const matchId = await store2.checkid(lastname, firstname)
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

const verifyAuthToken = async (req: Request, res: Response, next: any) => {
  try {
      const authorizationHeader = req.headers.authorization
      const token: string = authorizationHeader?.split(' ')[1] as string
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)
      const decodedToken: any = jwt_decode(token)
      const retrLastname = await store2.getLastname(decodedToken.user.lastname)
      const retrFirstname = await store2.getFirstname(decodedToken.user.firstname)
          /*console.log(retrLastname )
          console.log(retrFirstname )*/
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
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,// For legacy browser support
  methods: "GET"
}
const orderRoutes = (app: express.Application) => {
    app.get('/orders', cors(corsOptions), index)
    app.get('/orders/:id', cors(corsOptions), show)
    app.put('/users/:id/orders/:orderid', cors({
      origin: '*',
      optionsSuccessStatus: 200,// For legacy browser support
      methods: "PUT"
    }), verifyAuthToken, checkid, updateStatus)
    app.get('/current-order-by-user/:id', cors(corsOptions), verifyAuthToken, checkid, currentOrderByUser)
    app.get('/completed-orders-by-users/:id', cors(corsOptions), verifyAuthToken, checkid, completedOrdersByUser)
    // add product to an order
    app.post('/users/:id/orders/:orderid/products', cors({
      origin: '*',
      optionsSuccessStatus: 200,// For legacy browser support
      methods: "POST"
    }), verifyAuthToken, checkid, addProduct)
    app.post('/users/:id/orders/:orderid', cors({
      origin: '*',
      optionsSuccessStatus: 200,// For legacy browser support
      methods: "POST"
    }), verifyAuthToken, checkid, createOrder)
}
export default orderRoutes