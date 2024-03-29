/* eslint-disable no-console */
import path from 'path'
import fs from 'fs'
import { graphql } from 'graphql'
import chalk from 'chalk'
import { introspectionQuery, printSchema } from 'graphql/utilities'
import requireUncached from './requireUncached'

const schemaFile = path.join(__dirname, '../graphql/schema.js')
const jsonFile = path.join(__dirname, '../graphql/schema.json')
const graphQLFile = path.join(__dirname, '../graphql/schema.graphql')

async function updateSchema() {
  try {
    const schema = requireUncached(schemaFile).default
    const json = await graphql(schema, introspectionQuery)
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2))
    fs.writeFileSync(graphQLFile, printSchema(schema))
    console.log(chalk.green('Schema has been regenerated'))
  } catch (err) {
    console.error(chalk.red(err.stack))
  }
}

// Run the function directly, if it's called from the command line
if (!module.parent) updateSchema()

export default updateSchema
