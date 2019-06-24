interface Layout {
  title(title: string): Layout

  addStyleSheet(url: string, ...urls: string[]): Layout
}

declare namespace Express {
  interface Response {
    layout: Layout
  }
}
