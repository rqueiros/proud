const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
    buildSchema
} = require('graphql')
const path = require('path')

// Construct a schema
const schema = buildSchema(`
    type Query {
        resources: [Resource!]!
        resource(id: ID!): Resource
    }

    type Resource {
        id: ID!
        title: String!
        submissions: [Submission!]!
    }

    type Submission {
        id: ID!
        timestamp: String!
        duration: Int!
        attempts: Int!
        accepted: Boolean!
        level: Level!
        metadata: [Metadata]        
    }

    enum Level {
        BEGINNER
        EASY
        NORMAL
        HARD
        EXPERT
    }

    type Metadata {
        name: String!
        value: String!
    }
`);

// Some dummy data 
const proud = [{
    "id": "res-0",
    "title": "TicTacToe",
    "submissions": []
}, {
    "id": "res-1",
    "title": "BestPath",
    "submissions": [{
            "id": "sub-0",
            "timestamp": "",
            "duration": 233,
            "attempts": 2,
            "accepted": false,
            "level": "NORMAL"
        },
        {
            "id": "sub-1",
            "timestamp": "",
            "duration": 12,
            "attempts": 1,
            "accepted": true,
            "level": "EASY",
            "metadata": [{
                "name": "lines-code",
                "value": 12
            }]
        }
    ]
}]

// The root provides a resolver function for each API endpoint
const root = {
    resources: () => proud,
    resource: (args) => proud.filter(resource => resource.id === args.id)[0]
}

const app = express();
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');