/**
 * Executes and runs the specified script
 *
 */

import logger from '../../logger'

async function execute({ script, args }) {
  const started = new Date()
  logger.info(`Executing script: ${script}...`)

  let run
  try {
    run = require(`./${script}`).default
  } catch (err) {
    logger.error('Error loading script', { err, script })
    throw err
  }
  try {
    await run(...args)
  } catch (err) {
    logger.error('Error running script', { err, script })
    throw err
  }
  const ended = new Date()
  logger.info(`...executed script: ${(ended - started) / 1000} seconds`)
}

execute({ script: process.argv[2], args: process.argv.slice(3) }).catch((err) => {
  logger.error(err)
  /* eslint-disable no-undef */
  os.exit(1)
  /* eslint-enable no-undef */
})
