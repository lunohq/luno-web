import RedisDataStore from 'slack-redis-data-store'

let dataStore

export default function getDataStore() {
  if (!dataStore) {
    dataStore = new RedisDataStore({ redisOpts: { host: process.env.REDIS_HOST } })
  }
  return dataStore
}
