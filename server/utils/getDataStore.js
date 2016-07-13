import RedisDataStore from 'slack-redis-data-store'

let dataStore

export default function getDataStore(teamId) {
  if (!dataStore) {
    dataStore = new RedisDataStore({
      keyPrefix: `s.cache.${teamId}.`,
      redisOpts: { host: process.env.REDIS_HOST },
    })
  }
  return dataStore
}
