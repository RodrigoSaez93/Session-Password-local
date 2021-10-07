const { schema } = require("normalizr");

const authorSchema = new schema.Entity('authors', {}, {
    idAttribute: 'email'
});

const messageSchema = new schema.Entity('messages', {
    author: authorSchema
}, {
    idAttribute: '_id'
})

const messageListSchema = [messageSchema]

module.exports = messageListSchema;