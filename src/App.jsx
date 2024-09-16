import React from 'react';
import {
  Featured,
  Hero,
  Products,
  Highlight,
  Stories,
  Cart,
  Login,
  Layout,
  Register,
  ProductDetails,
  ProtectedRoute,
  Profile,
  Checkout,
  PaymentSuccess
} from './components';
import {heroapi, popularsales, toprateslaes, highlight, sneaker, story} from './data/data.js'
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Notfound from './components/Notfound.jsx';

let routers = createBrowserRouter([
  {path: '' , element: <Layout />, children :[
    {
      index: true, element:
        <ProtectedRoute>
          <Hero heroapi={heroapi} />
        </ProtectedRoute>
    },
    {
      path: 'cart', element:
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
    },
    {
      path: 'products', element:
        <ProtectedRoute>
          <Products endpoint={toprateslaes} />
        </ProtectedRoute>
    },
    {
      path: 'featured', element:
        <ProtectedRoute>
        <Featured endpoint={sneaker} />
        </ProtectedRoute>
    },
    {
      path: 'highlight', element:
        <ProtectedRoute>
        <Highlight endpoint={highlight} ifExists />
        </ProtectedRoute>
    },
    {
      path: 'story', element:
        <ProtectedRoute>
          <Stories story={story} />
        </ProtectedRoute>
    },
    {
      path: 'profile', element:
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
    },
    {
      path: '/product/:id', element:
        <ProtectedRoute>
          <ProductDetails endpoint={toprateslaes} />
        </ProtectedRoute>
    },
    {
      path: '/checkout', element:
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
    },
    {
      path: '/paymentsuccess', element:
        <ProtectedRoute>
          <PaymentSuccess />
        </ProtectedRoute>
    },
    {path:'login', element: <Login />},
    { path: 'register', element: <Register /> },
    
    {path: '*', element: <Notfound /> },
    
  ]}
])

const App = () => {
  return (
    <>
    <RouterProvider router={routers}>
        <Toaster />
    </RouterProvider>
    </>
  )
}

export default App;