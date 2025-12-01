// Entry point for repository implementations.
// By default uses in-memory repo. To use Firebase, set env var REPO_IMPL='firebase'

const impl = process.env.REPO_IMPL === 'firebase' ? './repo.firebase' : './repo.memory';

module.exports = require(impl);
