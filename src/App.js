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

const SearchForm = ({ value, onChange }) => {
  return (
    <form onSubmit={(ev) => ev.preventDefault()}>
      <input value={value} onChange={(ev) => onChange(ev.currentTarget.value)} />
    </form>
  )
}

const Content = ({ variables }) => {
  const { after, before, first, last, query } = variables
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: { after, before, first, last, query },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {error.message}</p>

  console.log(data)

  return (
    <>
      <Title data={data} />
      <ul>
        {data.search.edges.map((edge) => {
          return <RepositoryRow edge={edge} key={edge.node.id} />
        })}
      </ul>
    </>
  )
}

const RepositoryRow = ({ edge }) => {
  const { node } = edge

  return (
    <li>
      <a href={node.url} target={'_blank'} rel={'noopener'}>
        {node.name}
      </a>
    </li>
  )
}

const Title = ({ data }) => {
  const { repositoryCount } = data.search
  const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
  const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`

  return <h2>{title}</h2>
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
      <SearchForm value={variables.query} onChange={updateQuery} />
      <Content variables={variables} />
    </div>
  )
}

export default App
