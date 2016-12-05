import RedisDataStore from 'slack-redis-data-store'

export default function getDataStore(auth) {
  let dataStore
  if (auth && auth.tid) {
    dataStore = new RedisDataStore({
      keyPrefix: `s.cache.${auth.tid}.`,
      redisOpts: { host: process.env.REDIS_HOST },
    })
  }
  return dataStore
}
