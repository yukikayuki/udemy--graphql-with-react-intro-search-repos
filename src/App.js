import { useQuery, useMutation } from '@apollo/client'
import { ADD_START, REMOVE_STAR, SEARCH_REPOSITORIES } from './graphql'
import { createRef, forwardRef, useState } from 'react'

const PRE_PAGE = 5
const VARIABLES = {
  first: PRE_PAGE,
  after: null,
  last: null,
  before: null,
  query: '',
}

const SearchForm = forwardRef(({ onSubmit }, ref) => {
  return (
    <form onSubmit={onSubmit} ref={ref}>
      <input name={'query'} />
    </form>
  )
})

const Content = ({ variables, updatePaginationToNext, updatePaginationToPrev }) => {
  const { after, before, first, last, query } = variables
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: { after, before, first, last, query },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {error.message}</p>

  const { edges, pageInfo } = data.search

  return (
    <>
      <Title data={data} />
      <ul>
        {edges.map((edge) => {
          return (
            <RepositoryRow
              key={edge.node.id}
              edge={edge}
              variables={{ after, before, first, last, query }}
            />
          )
        })}
      </ul>

      {pageInfo.hasPreviousPage && (
        <button type={'button'} onClick={updatePaginationToPrev.bind(this, pageInfo)}>
          Prev
        </button>
      )}

      {pageInfo.hasNextPage && (
        <button type={'button'} onClick={updatePaginationToNext.bind(this, pageInfo)}>
          Next
        </button>
      )}
    </>
  )
}

const RepositoryRow = ({ edge, variables }) => {
  const { node } = edge

  const startCount = node.stargazerCount === 1 ? ' 1 star' : `${node.stargazerCount} stars`

  const mutationOptionsOfStarControl = {
    variables: {
      input: {
        starrableId: node.id,
      },
    },
    // サーバからrefetchする場合
    // refetchQueries: (nutationResult) => {
    //   console.log(nutationResult)
    //   return [{ query: SEARCH_REPOSITORIES, variables }]
    // },
    // cacheを直接いじる場合
    update: (cache, { data: { addStar, removeStar } }) => {
      const currentData = cache.readQuery({
        query: SEARCH_REPOSITORIES,
        variables,
      })

      const { starrable } = addStar ?? removeStar // starrableの型が同じなので可能な技

      const newEdges = currentData.search.edges.map((edge) => {
        if (edge.node.id === node.id) {
          const diff = starrable.viewerHasStarred ? 1 : -1
          return {
            ...edge,
            node: {
              ...edge.node,
              stargazerCount: edge.node.stargazerCount + diff,
            },
          }
        } else {
          return edge
        }
      })

      const newData = {
        ...currentData,
        search: {
          ...currentData.search,
          edges: newEdges,
        },
      }

      cache.writeQuery({ query: SEARCH_REPOSITORIES, data: newData })
    },
  }

  const [addStar] = useMutation(ADD_START, mutationOptionsOfStarControl)
  const [removeStar] = useMutation(REMOVE_STAR, mutationOptionsOfStarControl)

  return (
    <li>
      <a href={node.url} target={'_blank'} rel={'noreferrer'}>
        {node.name}
      </a>
      &nbsp;
      <button type={'button'} onClick={node.viewerHasStarred ? removeStar : addStar}>
        {startCount} | {node.viewerHasStarred ? 'starred' : '-'}
      </button>
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

  function updatePaginationToNext(pageInfo) {
    setVariables({
      ...variables,
      first: PRE_PAGE,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    })
  }

  function updatePaginationToPrev(pageInfo) {
    setVariables({
      ...variables,
      first: null,
      after: null,
      last: PRE_PAGE,
      before: pageInfo.startCursor,
    })
  }

  return {
    variables,
    updateQuery,
    updatePaginationToNext,
    updatePaginationToPrev,
  }
}

function App() {
  const { variables, updateQuery, updatePaginationToNext, updatePaginationToPrev } =
    useVariables(VARIABLES)

  const ref = createRef()
  const handleSubmit = (ev) => {
    ev.preventDefault()
    updateQuery(ref.current.query.value)
  }

  return (
    <div>
      <SearchForm onSubmit={handleSubmit} ref={ref} />
      <Content
        variables={variables}
        updatePaginationToNext={updatePaginationToNext}
        updatePaginationToPrev={updatePaginationToPrev}
      />
    </div>
  )
}

export default App
