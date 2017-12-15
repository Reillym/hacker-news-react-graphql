import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { timeDifferenceForDate } from '../utils'
import { GC_USER_ID } from '../constants'

class Link extends Component {
  render() {
    const { link, index } = this.props
    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{index + 1}.</span>
          {userId && (
            <div className="ml1 gray f11" onClick={() => this._voteForLink()}>
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div>
            {link.description} ({link.url})
          </div>
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Anonymous'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    const { link, createVoteMutation, updateStoreAfterVote } = this.props
    const userId = localStorage.getItem(GC_USER_ID)
    const voterIds = link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userId)) {
      console.log(`User ${userId} already voted for this link.`)
      return
    }

    const linkId = link.id
    await createVoteMutation({
      variables: {
        userId,
        linkId,
      },
      update: (store, { data: { createVote } }) => {
        updateStoreAfterVote(store, createVote, linkId)
      }
    })
  }
}

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default graphql(CREATE_VOTE_MUTATION, { name: 'createVoteMutation' })(Link)
