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

const SearchRepository = ({ variables }) => {
  const { after, before, first, last, query } = variables
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: { after, before, first, last, query },
  })

  console.log(data)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {error.message}</p>

  return <div></div>
}

const SearchForm = ({ value, onChange }) => {
  return (
    <form onSubmit={(ev) => ev.preventDefault()}>
      <input value={value} onChange={(ev) => onChange(ev.currentTarget.value)} />
    </form>
  )
}

function useVariables(defaultVariables) {
  const [variables, setVariables] = useState(VARIABLES)

  function updateQuery(query) {
    setVariables({ ...variables, query })
  }

  return {
    variables,
    updateQuery,
  }
}

function App() {
  const { variables, updateQuery } = useVariables(VARIABLES)

  return (
    <div>
      Hello GraphQL
      <SearchForm value={variables.query} onChange={updateQuery} />
      <SearchRepository variables={variables} />
    </div>
  )
}

export default App
