import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';
import express from 'express';

// GraphQl Schema (type definition)
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

// dummy db
const userData = [
  { id: '1', name: 'Sifat Bin Anwar', email: 'sifatbin.official@gmail.com' },
  { id: '2', name: 'Karim Uddin', email: 'karim93@gmail.com' },
];

// Resolvers
const resolvers = {
  Query: {
    // get all users query
    users: () => userData,

    // exact user query by id
    user: (_: any, args: { id: string }) => {
      return userData.find((user) => user.id === args.id);
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
