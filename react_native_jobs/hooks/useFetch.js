import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const options = {
    method: 'GET',
    url: `https://614ad4da07549f001755aa54.mockapi.io/${endpoint}`,
    headers: {},
    params: { ...query },
  }

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await axios.request(options)
      console.log('data => ', response.data)

      setData(response.data)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = async () => {
    await fetchData()
  }

  return { data, isLoading, error, refetch }
}

export default useFetch
