const express =  require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose')

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolver/index')
const isAuth = require('./middleware/is-auth');
 
const app = express();

app.use(bodyParser.json()); 

// every request would pass this middleware
app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}))


mongoose.connect('mongodb://localhost/events-react-dev', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
    app.listen(3000); 
}
    
).catch(err=>{
    console.log(err); 
})
