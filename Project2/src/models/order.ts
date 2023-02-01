// @ts-ignore
import Client from '../database'
import { Product, ProductStore } from './product';
import { User, UserStore } from './user';

export type Order = {
     id?: string;
     order_id: string;
     status: string;
     user_id: string;
     product_id: string;
     quantity: Number;
}

export class OrderStore {

  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders'
  
      const result = await conn.query(sql)
  
      conn.release()
  
      return result.rows 
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
    const sql = 'SELECT * FROM orders WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    conn.release()

    return result.rows[0]
    } catch (err) {
        throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

async currentOrderByUser(userId: string): Promise<{order_id: string}> {
  try {
    const sql = 'select order_id from orders where id = (select max(id) from orders) and user_id = $1'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [userId])

      const orderId = result.rows[0]
      return orderId
  } catch (err) {
    throw new Error(`Could not find current order for user ${userId}: ${err}`)
  }
}

async completedOrdersByUser(userId: string): Promise<{order_id: string}[]> {
  try {
    const sql = "select order_id from orders where status = 'complete' and user_id = $1"
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [userId])

      const orderId = result.rows
      return orderId
  } catch (err) {
    throw new Error(`Could not find completed orders for user ${userId}: ${err}`)
  }
}

  async addProduct(o: Order): Promise<Order> {
    try { 
      const prodStore = new ProductStore(); 
      if (!await prodStore.show(o.product_id)) { 
        const order_elt = {
          order_id: '',
          product_id: o.product_id,
          quantity: 0,
          user_id: '',
          status: ''
        }
        return order_elt
      }
      const user_store = new UserStore()
      const prod = await user_store.show(o.user_id)
      if (!prod) { 
        const order_elt2 = {
          order_id: '',
          product_id: o.product_id,
          quantity: 0,
          user_id: o.user_id,
          status: ''
        }
        return order_elt2
      }
      const sql = 'INSERT INTO orders (order_id, quantity, user_id, product_id, status) VALUES($1, $2, $3, $4, $5) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [o.order_id, o.quantity, o.user_id, o.product_id, o.status])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${o.product_id} to order ${o.id}: ${err}`)
    }
  }
  
}