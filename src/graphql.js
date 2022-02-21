import { gql } from '@apollo/client'

export const SEARCH_REPOSITORIES = gql`
  query searchRepositories(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $query: String!
  ) {
    search(
      first: $first
      after: $after
      last: $last
      before: $before
      query: $query
      type: REPOSITORY
    ) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            url
            stargazerCount
            viewerHasStarred
          }
        }
      }
    }
  }
`

export const ME = gql`
  query me {
    user(login: "yukikayuki") {
      name
      login
      avatarUrl
    }
  }
`
