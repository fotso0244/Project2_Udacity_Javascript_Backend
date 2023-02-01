import bcrypt from 'bcrypt'
import Client from '../database'
import dotenv from 'dotenv'

dotenv.config()

const { 
  SALT_ROUNDS,
  BCRYPT_PASSWORD } = process.env
export type User = {
    id?: String;
    firstname: String;
    lastname: String;
    password_digest: String;
}

export class UserStore {

    async index(): Promise<User[]> {
      try {
        // @ts-ignore
        const conn = await Client.connect()
        const sql = 'SELECT * FROM users'
    
        const result = await conn.query(sql)
    
        conn.release()
    
        return result.rows 
      } catch (err) {
        throw new Error(`Could not get users. Error: ${err}`)
      }
    }
  
    async show(id: string): Promise<User> {
      try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [id])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find order ${id}. Error: ${err}`)
      }
    }

    async getLastname(lastname: string): Promise<{lastname: string}> {
      try {
      const sql = 'SELECT lastname FROM users WHERE lastname=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [lastname])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find user with lastname ${lastname}. Error: ${err}`)
      }
    }

    async getFirstname(firstname: string): Promise<{firstname: string}> {
      try {
      const sql = 'SELECT firstname FROM users WHERE firstname=($1)'
      // @ts-ignore
      const conn = await Client.connect()
  
      const result = await conn.query(sql, [firstname])
  
      conn.release()
  
      return result.rows[0]
      } catch (err) {
          throw new Error(`Could not find user with firstname ${firstname}. Error: ${err}`)
      }
    }

    async create(u: User): Promise<User> {
        try {
      const sql = 'INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *'
      const hash = bcrypt.hashSync(
        u.password_digest + BCRYPT_PASSWORD, 
        parseInt(SALT_ROUNDS as string)
      );
      // @ts-ignore
      const conn = await Client.connect()
    
      const result = await conn
          .query(sql, [u.firstname, u.lastname, hash])
    
      const user = result.rows[0]
    
      conn.release()
    
      return user
        } catch (err) {
            throw new Error(`unable create user (${u.firstname} + ${u.lastname}): ${err}`)
        }
    }

    async update(id: Number, password: string): Promise<User> {
        try {
          // @ts-ignore
          const conn = await Client.connect()
          const hash = bcrypt.hashSync(
            password + BCRYPT_PASSWORD, 
            parseInt(SALT_ROUNDS as string)
          );
          const sql = 'UPDATE users SET password_digest = $2 WHERE id = $1 RETURNING *'
          /*INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING **/
    
    
          const result = await conn.query(sql, [id, hash])
          const user = result.rows[0]
    
          conn.release()
    
          return user
        } catch(err) {
          throw new Error(`unable update userid (${id}): ${err}`)
        } 
      }

      async checkid(lastname: string, firstname: string): Promise<Number> {
        try {
        const sql = 'SELECT id FROM users WHERE lastname=($1) and firstname=($2)'
        // @ts-ignore
        const conn = await Client.connect()
    
        const result = await conn.query(sql, [lastname, firstname])
    
        conn.release()
    
        return result.rows[0].id
        } catch (err) {
            throw new Error(`Could not find user ${lastname}+' '+${firstname}. Error: ${err}`)
        }
      }

      async authenticate(u: User): Promise<User | null> {
        const conn = await Client.connect()
        const sql = 'SELECT password_digest FROM users WHERE lastname=($1) and firstname=($2)'
    
        const result = await conn.query(sql, [u.lastname, u.firstname])
    
        //console.log(u.password_digest+BCRYPT_PASSWORD)
    
        if(result.rows.length) {
    
          const user = result.rows[0]
    
          //console.log(user)
    
          if (bcrypt.compareSync(u.password_digest+BCRYPT_PASSWORD, user.password_digest)) { 
            return user
          }
        }
    
        return null
      }
}