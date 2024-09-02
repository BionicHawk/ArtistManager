import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import { RouterProvider } from 'react-router-dom'
import routes from './router/routes'
import { ThemeProvider } from '@emotion/react'
import { theme } from './theme/theme'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ThemeProvider theme={ theme }>
      <RouterProvider router={ routes } />
    </ThemeProvider>
  </React.StrictMode>
)
