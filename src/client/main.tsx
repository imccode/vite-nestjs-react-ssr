import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

export const createApp = (url: string, initData: InitData = {}) => {
  if (!import.meta.env.SSR) {
    ReactDom.render(<App />, document.getElementById('app'))
  }

  return { app: <App router={{ location: url }} /> }
}

interface InitData {
  store?: any
}
