import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App'
import './index.css'
import Store from './app/Store.js';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='1055489014642-6pbk01j2rkphcklj1rnlv9m6k7g0sku7.apps.googleusercontent.com'>
  <React.StrictMode>
    <Provider store={Store}>
      <Toaster position='top-center' reverseOrder={false} />
    <App />
    </Provider>
  </React.StrictMode>,
  </GoogleOAuthProvider>  
)
