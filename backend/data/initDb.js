const Database = require('better-sqlite3')

const { createSchema } = require('./schema')
const { createDbHelpers } = require('./dbHelpers')
const { seedDatabase } = require('./seed')

const db = new Database('data/re-junior.db')

createSchema(db)

const dbHelpers = createDbHelpers(db)

seedDatabase(dbHelpers)

console.log('Database initialized successfully')
