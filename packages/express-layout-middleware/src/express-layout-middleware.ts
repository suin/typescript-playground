/// <reference path="./express.d.ts" />

import {NextFunction, Request, Response} from 'express'
import {is} from 'type-is'

/**
 * Determine if the given response is HTML.
 */
const responseIsHtml = (res: Response, body?: any): body is string =>
  typeof body === 'string' && contentTypeIsHtml(res.get('Content-Type'))

/**
 * Determine if the given Content-Type is HTML.
 */
const contentTypeIsHtml = (contentType?: string): boolean =>
  // Express.js regards undefined Content-Type as text/html
  // @see https://github.com/expressjs/express/blob/4.17.1/lib/response.js#L144-L145
  contentType === undefined || is(contentType, ['html']) === 'html'

interface LayoutOptions {
  title?: string
  stylesheets?: string[]
}

class LayoutManager implements Layout {
  constructor(readonly options: LayoutOptions) {
  }

  title(title: string): Layout {
    this.options.title = title
    return this
  }

  addStyleSheet(url: string, ...urls: string[]): Layout {
    this.options.stylesheets = this.options.stylesheets || []
    this.options.stylesheets.push(url, ...urls)
    return this
  }
}

export const layout = (name: string, options?: LayoutOptions) => (req: Request, res: Response, next: NextFunction) => {
  const layout = new LayoutManager(options || {})
  res.layout = layout

  const send = res.send.bind(res)

  res.send = (body?: any): Response => {
    if (!responseIsHtml(res, body)) {
      return send(body)
    }

    req.app.render(name, {...layout.options, body}, (err, html) => {
      if (err) return next(err)
      send(html)
    })
    return res
  }

  next()
}
