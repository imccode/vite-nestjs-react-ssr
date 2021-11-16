import React from 'react'
import { useNavigate } from 'react-router'
import { RouterContainer, RouterContainerProps } from './router'

const App = ({ router = {} }: AppProps) => {
  return (
    <>
      <button>
        go about
      </button>
      <button>
        go home
      </button>
      <RouterContainer {...router} />
    </>
  )
}

export default App

export interface AppProps {
  router?: RouterContainerProps
}
