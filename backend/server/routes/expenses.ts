import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator'

const expenseSchema=z.object({
    id:z.number().int().positive(),
    title:z.string().min(3).max(100),
    amount:z.number().int().positive(),
})

const createPostSchema=expenseSchema.omit({id:true})

type expenses=z.infer<typeof expenseSchema>

const fakeExpenses: expenses[] = [
    {
        id: 1,
        title: "Groceries",
        amount: 100
    },
    {
        id: 2,
        title: "Rent",
        amount: 2000
    },
    {
        id: 3,
        title: "Electricity",
        amount: 150
    }
]


export const expensesRoutes=new Hono()
.get("/",c=>{
    return c.json({expenses:fakeExpenses})
})

.post("/",zValidator("json",createPostSchema),async c=>{
    const expenses= await c.req.valid("json")
    fakeExpenses.push({...expenses,id:fakeExpenses.length+1})
    
    return c.json(expenses)
})  
.get("/:id{[0-9]+}",c=>{
        const id=Number(c.req.param("id"))
        console.log("🚀 ~ id:", id)
        const expense=fakeExpenses.find(expense => {
            return expense.id===id
        })
        console.log("🚀 ~ expense:", expense)
        if(!expense){
            return c.notFound()
        }
        return c.json({expense})

})
.delete("/:id{[0-9]+}",c=>{
    const id=Number(c.req.param("id"))
    console.log("🚀 ~ id:", id)
    const expense=fakeExpenses.filter(expense => {
        return expense.id!==id
    })
    console.log("🚀 ~ expense:", expense)
    if(!expense){
        return c.notFound()
    }
    return c.json({expense})

})