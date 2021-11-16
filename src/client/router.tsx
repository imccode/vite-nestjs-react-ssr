import React from 'react'
import {
  BrowserRouter, Route, RouteProps, Routes
} from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import AboutPage from './pages/about'
import HomePage from './pages/home'

const routes: RouteProps[] = [
  {
    path: '/home',
    index: true,
    caseSensitive: true,
    // children: lazy(() => import('./pages/about')),
    element: <HomePage />,
  },
  {
    path: '/about',
    caseSensitive: true,
    // children: lazy(() => import('./pages/about')),
    element: <AboutPage />,
  },
]

export const RouterContainer = ({
  location,
  basename = '/',
}: RouterContainerProps) => {
  const RouterProvide = import.meta.env.SSR ? StaticRouter : BrowserRouter

  return (
    <RouterProvide location={location} basename={basename}>
      <Routes>
        {routes.map((route) => (
          <Route {...route} />
        ))}
      </Routes>
    </RouterProvide>
  )
}

export interface RouterContainerProps {
  location?: string
  basename?: string
}
