import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
// GraphQL
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-client-preset'

import { GC_AUTH_TOKEN } from './constants'

const serviceId = process.env.SERVICE_ID || '__SERVICE_ID__'

// HttpLink connects ApolloClient instance with GraphQL API
const httpLink = new HttpLink({
  uri: `https://api.graph.cool/simple/v1/${serviceId}`,
})

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(GC_AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

// ApolloClient
const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
)

registerServiceWorker()
