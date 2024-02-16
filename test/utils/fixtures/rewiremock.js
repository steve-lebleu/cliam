const rewiremock = require('rewiremock/node'); 
// nothng more than `plugins.node`, but it might change how filename resolution works
/// settings
rewiremock.overrideEntryPoint(module); // this is important
module.exports = rewiremock;