import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
// import TestApp from './components/Test.tsx'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import Conversation from './components/Conversation.tsx'
import TestApp from './components/Test.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="/:chatID?" element={<Conversation></Conversation>}>
          </Route>
        </Route>
      </Routes>
      {/* <TestApp /> */}
    </BrowserRouter>
  </StrictMode>,
)
