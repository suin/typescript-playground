import express, {Response} from "express"

const app = express()

app.set('x-powered-by', false) // sub-appに影響しない
app.set('views', 'root-app-views') // sub-appに影響しない

// application level middlewareはsub-appのルーティングにも適用される
app.use((req, res, next) => {
  res.header('X-Root-App-Middleware', '1')
  next()
})

// 設定値はsub-appでも参照可能
app.set('root-app-some-value', 'root-app-some-value')

// sub-app-1
const subApp1 = express()
subApp1.use((req, res, next) => {
  res.header('X-Sub-App-1-Middleware', '1')
  next()
})
subApp1.get('/', (req, res) => {
  res.header('X-App-Locals', JSON.stringify(req.app.locals))
  res.header('X-Root-App-Value', JSON.stringify(req.app.get('root-app-some-value')))
  res.send('sub-app 1')
})
app.use('/sub1', subApp1)

// sub-app-2
const subApp2 = express()
subApp2.use((req, res, next) => {
  res.header('X-Sub-App-2-Middleware', '1')
  next()
})
subApp2.get('/', (req, res) => {
  res.send('sub-app 2')
})
app.use('/sub2', subApp2)

app.get('/', (req, res: Response) => {
  res.header('X-App-Locals', JSON.stringify(req.app.locals))
  res.header('X-Root-App-Value', JSON.stringify(req.app.get('root-app-some-value')))
  res.header('X-Sub-App-1', subApp1.mountpath as string)
  res.header('X-Sub-App-2', subApp2.mountpath as string)
  res.send('root app')
})

app.listen(3000)
