import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expensesRoutes } from './routes/expenses'

const app = new Hono()



app.route("/api/expenses",expensesRoutes)
app.use('*',logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/test', (c) =>{
  return c.json({"message":"this is test page"})
})

export default app