require('dotenv').config();
// Express
import express from 'express';
import mongoose from 'mongoose';
// Apollo / GQL
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

const startServer = async () => {
  console.log('[SERVER] Starting express server...');
  const app = express();

  console.log('[SERVER] Starting apollo server...');
  const server = new ApolloServer({ typeDefs, resolvers });

  // Apply Middlewares
  console.log('[SERVER] Applying middleware...');
  server.applyMiddleware({ app });

  // Connect MongoDB with mongoose
  console.log('[SERVER] Connecting to MongoDB...');

  mongoose
    .connect(`${process.env.MONGO_CONNECTION_STRING}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      app.listen({ port: 4000 }, () =>
        console.log(
          `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
        )
      )
    )
    .catch((mongoConnectionError) => {
      console.log(
        '[SERVER] We have a problem connecting to MongoDB...',
        mongoConnectionError
      );
      throw new Error(mongoConnectionError);
    });
};

startServer();
