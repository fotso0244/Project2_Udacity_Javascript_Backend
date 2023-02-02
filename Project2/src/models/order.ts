// @ts-ignore
import Client from '../database'
import { Product, ProductStore } from './product';
import { User, UserStore } from './user';

export type Order = {
     id?: string;
     order_id: string;
     status: string;
     user_id: string;
     //product_id: string;
     //quantity: Number;
}
export type OrderProduct = {
  id?: string;
  order_id: string;
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

async completedOrdersByUser(userId: string): Promise<{id: string}[]> {
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

async create_order(o: Order) {
  const sql = 'INSERT INTO orders (order_id, user_id, status) VALUES($1, $2) RETURNING *'
  //@ts-ignore
  const conn = await Client.connect()

  const result = await conn
      .query(sql, [o.order_id, o.user_id, o.status])

  const order = result.rows[0]

  conn.release()
  return order
}

async updateStatus(id: string, status: string): Promise<Order> {
  try {
    // @ts-ignore
    const conn = await Client.connect()
    const sql = 'UPDATE orders SET status = $2 WHERE order_id = $1 RETURNING *'
    /*INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING **/


    const result = await conn.query(sql, [id, status])
    const order = result.rows[0]

    conn.release()

    return order
  } catch(err) {
    throw new Error(`unable update status for order (${id}): ${err}`)
  } 
}

  async addProduct(op: OrderProduct, o: Order): Promise<OrderProduct> {
    try { 
      const prodStore = new ProductStore(); 
      if (!await prodStore.show(op.product_id)) { 
        const orderProd_elt = {
          order_id: '',
          product_id: op.product_id,
          quantity: 0
          //user_id: '',
          //status: ''
        }
        return orderProd_elt
      }
      const user_store = new UserStore()
      const user = await user_store.show(o.user_id)
      const order = await this.show(o.id as string)
      if (!user) {
        const order_elt = {
          order_id: '',
          product_id: '',
          quantity: 0,
        }
        return order_elt
      }
      if ((!order) && user) { 
        const order_elt = await this.create_order(o)
        const sql = 'INSERT INTO orders_products (order_id, quantity, product_id) VALUES($1, $2, $3) RETURNING *'
        //@ts-ignore
        const conn = await Client.connect()
  
        const result = await conn
            .query(sql, [op.order_id, op.quantity, op.product_id])
  
        const orderProduct = result.rows[0]
  
        conn.release()
        return orderProduct
      }
      else {
        if (order && order.status == 'complete') {
            const order_elt = {
              order_id: op.order_id,
              product_id: '',
              quantity: 0
            }
            return order_elt
        }
      }
      if ((order.status == 'activate') && order.user_id == user.id) {
        const sql = 'INSERT INTO orders_products (order_id, quantity, product_id) VALUES($1, $2, $3) RETURNING *'
        //@ts-ignore
        const conn = await Client.connect()
  
        const result = await conn
            .query(sql, [op.order_id, op.quantity, op.product_id])
  
        const orderProduct = result.rows[0]
  
        conn.release()
        return orderProduct
      }
      return ({
        order_id: '',
        product_id: '',
        quantity: 0
      })
    } catch (err) {
      throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}: ${err}`)
    }
  }
  
}