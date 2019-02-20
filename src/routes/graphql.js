import { Router } from "express";
import { userController } from "../graphql/users";

export const graphqlTestRouter = new Router();

graphqlTestRouter.route('/')
  .get((req, res) => {
    res.send('get: respond with a resource');
  })
  .put((req, res) => {
    res.send('put: respond with a resource');
  })
  .delete((req, res) => {
    res.send('delete: respond with a resource');
  })
  .post((req, res) => {
    res.send('post: respond with a resource');
  });
graphqlTestRouter.route('/users')
  .get(userController.getAll)
  .put(userController.updateOne)
  .post(userController.createOne);
