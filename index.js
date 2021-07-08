require('dotenv').config();
const { ApolloServer, UserInputError, gql } = require('apollo-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./src/models/user');
const Task = require('./src/models/task');
const Group = require('./src/models/group');
const Subtask = require('./src/models/subtask');

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
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
    id: ID!
  }

  type Subtask {
    name: String!
    creator: User!
    parentTask: Task!
    userSubtaskPointedTo: User
    done: Boolean
    id: ID!
  }

  type Group {
    name: String!
    owner: User!
    participiants: [User!]
    admins: [User!]
    id: ID!
  }

  input UserInput {
    name: String!
    password: String!
    yearsInOrganization: Int!
    position: String!
  }
 
  input GroupInput {
    name: String!
    ownerID: ID!
  }  

  type Query {
    allUsers: [User!]!
    allTasks: [Task!]!
    allSubtasks: [Subtask!]!
    allGroups: [Group!]!
  }

  type Mutation {
    addUser(userInput: UserInput): User
    addGroup(groupInput: GroupInput): Group
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
    addUser: async (root, args) => {
      const {
        name, yearsInOrganization, position, password,
      } = args.userInput;

      const user = new User({ name, yearsInOrganization, position });

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      user.passwordHash = passwordHash;

      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args.userInput,
        });
      }

      return user;
    },
    addGroup: async (root, args) => {
      const { name, ownerID } = args.groupInput;
      const group = new Group({ name });
      const owner = await User.findOne({ _id: ownerID });

      group.owner = owner;

      try {
        await group.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args.groupInput,
        });
      }

      return group;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
