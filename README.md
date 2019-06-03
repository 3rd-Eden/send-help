# send-help

Generate developer friendly output of a help command based on a given object
structure.

## Installation

The module is published to the public npm repository and can be installed by
running:

```
npm install --save send-help
```

## Usage

The module exposes a single function, `send-help`, which requires the
following arguments:

- `commands` An object structure that contains our help information. See
  [commands](#commands) for the recommended data structure.
- `options` Additional configuration to fine tune the output.
  - `name` The name of CLI application.
  - `version` The current version.
  - `description` Brief description of the CLI.
  - `colors` Should we output colors, defaults to `true`.
  - `flags` Default values of our the CLI flags.
  - `prefix` Amount of spaces to prefix descriptions, defaults to `2`.
  - `specific` Name of the command that we need detailed, specific, information
    from.
  - `accent` a [kuler] compatible color string used as accent color.
  - `sutble` a [kuler] compatible color string used as subtle color.

```js
const help = require('send-help');

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
```

This will generate the following output:

```
npm (version: 1.2.3)
npm client as example

COMMANDS:

publish  Publish your package.
         --registry  Configures the registry.

LEARN MORE:

Each command has additional information available, you can find this by running:

  $ npm help <command>

Where <command> is the command you want to learn more of.
```

When we set the `specific` option to `publish` you will see more detailed about
the specific command:

```
npm (version: 1.2.3)
npm client as example

COMMAND:

publish  Publish your package. In-depth description here about the given
         command.
         --registry  Configures the registry. Additional details. Current value:
                     https://registry.npmjs.org/

EXAMPLES:

  $ npm publish

DEBUGGING:

Additional debug information for this command be found by starting it with DEBUG
environment flag:

  $ DEBUG=npm* publish publish # The rest of you CLI flags here
```

### commands

The commands object needs to follow a specific structure in order to render
the desired output. We assume the object that you supply has the name of
CLI commands as keys, and their command information object as value:

```js
{
  command: {
    // command information here
  }
}
```

The command information can contain the following properties:

- `description`, Array, Description of the command. The first item in the array
  will be used as default output. When `specific` information request all items
  of the array will be rendered.
- `examples`, Array, A list of examples of how to use the command. This will be
  shown when `specific` information is requested for the command.
- `flags`, Object, A Object where the key is the full CLI flag, and the value
  is a description array. The first item of the array will be used as default
  output. When `specific` information is requested all items of the array will
  be rendered.
- `debug`, String, When your command makes use of `diagnostics` or `debug` to
  output additional debug information, set it as this value.

So a full command specification would look like this:

```js
{
  publish: {
    description: [
      'Publish your package.',
      'All files that are found in the folder are published.',
      'To ignore files from publishing either use `.gitignore` or `.npmignore`.'
    ],
    examples: [
      'npm publish --registry https://foo.bar',
      'npm publish'
    ],
    debug: 'npm:publish*',
    flags: [
      '--registry': [
        'Registry to publish to.',
        'Used when you want to publish to a different registry.'
      ]
    ]
  }
}
```

Now if you want to get really fancy, instead of creating another dedicated
object structure that contains all this information, you could add it to
your functions as well, and pass those as methods:

```js
const help = require('send-help');

function publish() {}

publish.description = ['Description here'];
publish.flags = {
  '--registry': ['Configures the registry']
};

console.log(help({ publish }, require('./package.json')));
```

## License

[MIT]
