import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Link from './Link';

class LinkList extends Component {

  render() {
    const { allLinksQuery } = this.props
    if (allLinksQuery && allLinksQuery.loading) {
      return <div>Loading...</div>
    }
    if (allLinksQuery && allLinksQuery.error) {
      return <div>An Error Occured</div>
    }
    const linksToRender = allLinksQuery.allLinks
    return (
      linksToRender.map((link, index) => (
        <Link
          key={link.id}
          updateStoreAfterVote={this._updateCacheAfterVote}
          index={index}
          link={link}
        />
      ))
    );
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // Read current state of the cached data for the ALL_LINKS_QUERY
    const data = store.readQuery({ query: ALL_LINKS_QUERY })
    
    // Retreive the link that the user just voted for
    const votedLink = data.allLinks.find(link => link.id === linkId)
    // Reset votes to equal the votes returned from the server
    votedLink.votes = createVote.link.votes
    
    // take modified data and return it back to the store
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }
}
// gql parses our plain text that contians a graphql query
// We store the parsed GraphQL query in a constant
export const ALL_LINKS_QUERY = gql`
  # fetches all links in the database
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

// Apollo injects the graphql query data into the LinkedList as props with name 'allLinksQuery' using a higher-order component (HOC)
export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' }) (LinkList);