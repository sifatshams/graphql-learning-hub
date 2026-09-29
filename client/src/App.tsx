import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

// typeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user: {
    id: string;
    name: string;
  };
}

interface GetGraphQLData {
  getUsers: User[];
  getTodos: Todo[];
}

// graphQL query
const GET_DATA = gql`
  query GetData {
    getUsers {
      id
      name
      email
      phone
    }

    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

const App = () => {
  // type pass generics useQuery
  const { loading, error, data } = useQuery<GetGraphQLData>(GET_DATA);

  if (loading) {
    return <p className="text-center mt-20">Loading data...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 mx-auto min-h-screen text-center">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">GraphQL + React (Apollo Client)</h1>

      {/* users section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.getUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-500 text-xs mt-1">{user.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* todos section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Todos List</h2>
        <div className="space-y-2">
          {data?.getTodos.slice(0, 10).map((todo) => (
            <div
              key={todo.id}
              className={`p-3 border rounded-md flex justify-between items-center ${
                todo.completed ? 'bg-green-50' : 'bg-yellow-50'
              }`}
            >
              <div>
                <p
                  className={todo.completed ? 'line-through text-gray-500' : ''}
                >
                  {todo.title}
                </p>
                <span className="text-xs text-gray-500">
                  Assigned to: {todo.user?.name ?? 'Unknown'}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded text-white ${
                  todo.completed ? 'bg-green-600' : 'bg-yellow-600'
                }`}
              >
                {todo.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
