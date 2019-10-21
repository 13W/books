/**
 * Database initialize
 * @param config
 * returns {SQLDriver}
 */

module.exports = function init(config) {
  const {driver, [driver]: connectionConfig} = config;

  /**
   * @link SQLDriver
   * @type {SQLDriver}
   */
  const Driver = require(`./${driver}`);

  return new Driver(connectionConfig);
};
