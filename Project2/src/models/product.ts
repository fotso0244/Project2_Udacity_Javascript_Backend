// @ts-ignore
import Client from '../database'

export type Product = {
     id?: String;
     name_prod: String;
     price: Number;
     category?: String;
}

export class ProductStore {

    async index(): Promise<Product[]> {
      try {
        // @ts-ignore
        const conn = await Client.connect()
        const sql = 'SELECT * FROM products'
        const result = await conn.query(sql)
    
        conn.release()
    
        return result.rows 
      } catch (err) {
        throw new Error(`Could not get products. Error: ${err}`)
      }
    }
  
    async show(id: string): Promise<Product> {
      try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find product ${id}. Error: ${err}`)
      }
    }

    async mostPopularProducts(): Promise<Product[]> {
      try {
      const sql = 'SELECT * FROM products ORDER BY price ASC LIMIT 5'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql)
  
      conn.release()
  
      return result.rows
      } catch (err) {
          throw new Error(`Could not find most popular products. Error: ${err}`)
      }
    }

    async productsByCategory(category: string): Promise<Product[]> {
      try {
      const sql = 'SELECT * FROM products WHERE category = $1'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [category])
  
      conn.release()
  
      return result.rows
      } catch (err) {
          throw new Error(`Could not find products for category ${category}. Error: ${err}`)
      }
    }
  
    async create(p: Product): Promise<Product> {
      try {
    const sql = 'INSERT INTO products (name_prod, price, category) VALUES($1, $2, $3) RETURNING *'
    // @ts-ignore
    const conn = await Client.connect()
  
    const result = await conn
        .query(sql, [p.name_prod, p.price, p.category])
  
    const product = result.rows[0]
  
    conn.release()
  
    return product
      } catch (err) {
          throw new Error(`Could not add new product named ${p.name_prod} Error: ${err}`)
      }
  }
}