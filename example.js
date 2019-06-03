const help = require('./');

const output = help({
  publish: {
    description: ['Publish your package.', 'In-depth description here about the given command.'],
    examples: ['npm publish'],
    debug: 'npm*',
    flags: {
      '--registry': ['Configures the registry.', 'Additional details.']
    }
  }
}, {
  name: 'npm',
  version: '1.2.3',
  description: 'npm client as example',
  accent: '#EA2039',
  flags: {
    registry: 'https://registry.npmjs.org/'
  }
});

console.log(output);
