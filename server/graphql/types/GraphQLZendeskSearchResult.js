import { GraphQLObjectType, GraphQLString } from 'graphql'

import { registerType } from './registry'

const GraphQLZendeskSearchResult = new GraphQLObjectType({
  name: 'ZendeskSearchResult',
  description: 'Result from zendesk search',
  fields: () => ({
    url: {
      type: GraphQLString,
      description: 'Link to the zendesk article',
      resolve: obj => obj.html_url,
    },
    title: {
      type: GraphQLString,
      description: 'Title of the article',
    },
    labels: {
      type: GraphQLString,
      description: 'Labels associated with the article',
      resolve: obj => obj.label_names.join(', '),
    },
  }),
})

export default registerType({ type: GraphQLZendeskSearchResult })
