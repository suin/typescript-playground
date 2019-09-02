import Koa from "koa";
import _ from "koa-route";


const app = new Koa()
app.use(_.get('/old', async ctx => {
    ctx.redirect('/new')
}))
app.use(_.get('/new', async ctx => {
    ctx.body = 'redirected!'
}))

app.listen(4000, () => process.stdout.write('Web server started at port 4000\n'))
