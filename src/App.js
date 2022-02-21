import { useQuery } from '@apollo/client'
import { ME } from './graphql'

const Me = () => {
  const { loading, error, data } = useQuery(ME)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {error.message}</p>

  return <div>{data.user.login}</div>
}

function App() {
  return (
    <div>
      Hello GraphQL
      <Me />
    </div>
  )
}

export default App
