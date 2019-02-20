import { graphql } from "graphql";
import schema from "./schema/schema";
import bodyParser from 'body-parser';
import { orderRouter } from "./routes/order";
import indexRouter from "./routes";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import express from "express";
import createError from "http-errors";
import startDB from "./db";
import { rabbitMq } from "./messageQueue/messageQueue";
import { graphqlTestRouter } from "./routes/graphql";
import { graphqlServer } from "./routes/graphQLRouter";

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.text({ type: 'application/graphql' }));

app.post('/graphql/test', (req, res) => {
  graphql(schema, req.body)
    .then((result) => {
      res.send(JSON.stringify(result, null, 2));
    })
});

app.use('/', indexRouter);
app.use('/order', orderRouter);
app.use('/api', graphqlTestRouter);

graphqlServer.applyMiddleware({ app, path: '/graphql' });
// app.use('/docs', graphiqlExpress({ endpointURL: '/graphql' }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

startDB(app).then(() => {
  console.log('db stared')
});
rabbitMq();

export default app;
