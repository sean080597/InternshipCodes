import { notFound } from 'next/navigation'

const fetchTodo = async (todoId) => {
  return await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, { next: { revalidate: 60 } }).then((res) => res.json())
}

async function TodoPage({ params: { todoId } }) {
  const todo = await fetchTodo(todoId)
  console.log(todo)
  if (!todo.id) return notFound()

  return (
    <div className="p-10 m-2 bg-yellow-200 border-2 shadow-lg">
      <p>
        #{todo.id}: {todo.title}
      </p>
      <p>Completed: {todo.completed ? 'yes' : 'no'}</p>
      <p className="border-t border-black mt-5 text-right">By User: {todo.userId}</p>
    </div>
  )
}

export default TodoPage

export async function generateStaticParams() {
  const todos = await fetch(`https://jsonplaceholder.typicode.com/todos`).then((res) => res.json())
  // prebuilding 10 pages
  const trimmedTodos = todos.splice(0, 10)
  return trimmedTodos.map((item) => ({ todoId: item.id.toString() }))
}
