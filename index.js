require('dotenv').config();
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')

const User = require('./src/models/user');
const Task = require('./src/models/task');
const Group = require('./src/models/group');
const Subtask = require('./src/models/subtask');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = gql`
  type User {
    name: String!
    passwordHash: String!
    yearsInOrganization: Int!
    position: String!
    groups: [Group!]
    tasks: [Task!]
    subtasks: [Subtask!]
    id: ID!
  }

  type Task {
    name: String!
    urgent: Boolean!
    creator: User!
    groupLinkedTo: Group!
    subTasks: [Subtask!]
  }

  type Subtask {
    name: String!
    creator: User!
    parentTask: Task!
    userSubtaskPointedTo: User
    done: Boolean
  }

  type Group {
    name: String!
    owner: User!
    participiants: [User!]
    admins: [User!]
  }

  type Query {
    allUsers: [User!]!
    allTasks: [Task!]!
    allSubtasks: [Subtask!]!
    allGroups: [Group!]!
  }

  type Mutation {
    addUser(
      name: String!
      passwordHash: String!
      yearsInOrganization: Int!
      position: String!
    ): User
  }
`;

const resolvers = {
  Query: {
    allUsers: () => User.find({}),
    allTasks: () => Task.find({}),
    allSubtasks: () => Subtask.find({}),
    allGroups: () => Group.find({}),
  },
  Mutation: {
    addUser: (root, args) => {
      const user = new User({ ...args });
      return user.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
});