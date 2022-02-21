import { gql } from '@apollo/client'

export const ME = gql`
  query me {
    user(login: "yukikayuki") {
      name
      login
      avatarUrl
    }
  }
`
