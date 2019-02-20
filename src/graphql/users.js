import Users from '../db/entity/user'
import { generateControllers } from "./query";
import { merge } from "lodash";

const getUser = (parent, { name }, context, info) => {
  console.log(name);
  return { name }
};

const updateUser = (_, { input }, { user }) => {
  // merge(user, input);
  // return user.save()
};

const createUser = async (_, { name, userId, desc }, { user }) => {
  // merge(user, input);
  await new Users({ name, userId, desc }).save();
  return { name, desc, userId }
};

export const userController = generateControllers(Users);
export const userResolvers = {
  Query: {
    getUser
  },
  Mutation: {
    updateUser,
    createUser
  }
};


