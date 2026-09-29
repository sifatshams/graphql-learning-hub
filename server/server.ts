import { ApolloServer, gql } from 'apollo-server-express';
import axios from 'axios';
import 'dotenv/config';
import express from 'express';

// GraphQl Schema (type definition)
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
  }

  type Todo {
    id: ID!
    userId: ID!
    title: String!
    completed: Boolean!
    user: User
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
    getTodos: [Todo!]!
    getTodo(id: ID!): Todo
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // get all users
    getUsers: async () => {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      );
      return response.data;
    },

    // get user by id
    getUser: async (_: any, args: { id: string }) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${args.id}`,
      );
      return response.data;
    },

    // get all todos
    getTodos: async () => {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos',
      );
      return response.data;
    },

    // get todo by id
    getTodo: async (_: any, args: { id: string }) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos/${args.id}`,
      );
      response.data;
    },
  },

  // nested resolvers
  Todo: {
    user: async (parent: { userId: string }) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${parent.userId}`,
      );
      return response.data;
    },
  },
};

// Express & Apollo Server Start
const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // add apollo server with express app
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
};

startServer();
