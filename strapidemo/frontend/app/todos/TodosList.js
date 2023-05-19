import Link from 'next/link'

const fetchTodos = async () => {
  return await fetch('https://jsonplaceholder.typicode.com/todos').then((res) => res.json())
}

async function TodosList() {
  const todos = await fetchTodos()

  return (
    <>
      {todos.map((item) => (
        <p key={item.id}>
          <Link href={`/todos/${item.id}`}>Todo: {item.id}</Link>
        </p>
      ))}
    </>
  )
}

export default TodosList
