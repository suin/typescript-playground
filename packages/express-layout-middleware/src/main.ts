import express, {Request, Response} from 'express'
import pug from 'pug'
import {layout} from './express-layout-middleware'

const app = express()
app.set('view engine', 'pug')
app.use(layout('layout.pug'))
app.get('/', (req: Request, res: Response) => {
  res.layout
    .title('Blog Posts')
    .addStyleSheet('/static/blog.css', '/static/style2.css')
  res.render('index')
})
app.listen(3000)
