import { useQuery } from '@apollo/client'
import { SEARCH_REPOSITORIES } from './graphql'
import { useState } from 'react'

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア',
}

const SearchRepository = () => {
  const [variables, setVariables] = useState(VARIABLES)

  const { after, before, first, last, query } = variables
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: { after, before, first, last, query },
  })

  console.log(data)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {error.message}</p>

  return <div></div>
}

function App() {
  return (
    <div>
      Hello GraphQL
      <SearchRepository />
    </div>
  )
}

export default App
