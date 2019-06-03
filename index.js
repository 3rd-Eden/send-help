const kuler = require('kuler');

/**
 * Set of utilities that will write out output format to an internal
 * array so it can be used to compile an output.
 *
 * @param {Boolean} [colors] Colors are enabled
 * @returns {Object} The API.
 * @private
 */
function writer(colors = true) {
  const lines = [];

  return {
    paint: colors ? kuler : (x) => (x),
    write: (...args) => lines.push(...args),
    header: (name) => lines.push(name.toUpperCase() + ':', ''),
    example: (code) => lines.push('  $ '+ code),
    output: () => lines.join('\n')
  };
}

/**
 * Find the longest value in a given array.
 *
 * @param {Array} values The value to check.
 * @returns {Number} The length of the longest value.
 * @private
 */
function longest(values) {
  return Math.max(...values.map((value) => value.toString().length));
}

/**
 * Breaks the data into sentences that are prefixed with a given indent.
 * The first line will be prefixed with whatever you supply as prefix.
 *
 * @param {Number} indent Amount of chars to indent.
 * @param {String} data The data that needs to be chopped and formatted.
 * @param {Object} [prefix] Data to prefix the first line.
 * @returns {Array} The different lines generated.
 * @private
 */
function block(indent, data, { prefix, length, position = 0 } = {}) {
  const cols = 80;
  const lines = [];
  const words = data.split(' ');
  const padding = (new Array(indent)).fill(' ').join('');

  while (words.length) {
    let line = padding;

    while (words.length && line.length < cols) {
      const estimate = words[0].length + line.length;

      if (estimate > cols && line !== padding) break;
      line += words.shift() + ' ';
    }

    lines.push(line.trimRight());
  }

  if (prefix) {
    lines[0] = lines[0].slice(0, position) + prefix + lines[0].slice(position + length);
  }

  return lines;
}

/**
 * Generate the help page.
 *
 * @param {Object} data Command object.
 * @param {Object} options Help configuration.
 * @returns {String} The generated help.
 * @public
 */
function help(data, {
  subtile = 'dimgray',  // Subtile color.
  version = '0.0.0',    // Version number your app.
  accent = 'orange',    // Accent color.
  description,          // Description of your app.
  flags = {},           // Default values of your flags.
  prefix = 2,           // Amount of spaces to prefix descriptions.
  specific,             // Do we need to provide specific information.
  colors,               // Enable the use of colors.
  name                  // Name of your app.
} = {}) {
  const { write, header, example, paint, output } = writer(colors);
  const keys = Object.keys(data);
  const longestCommand = longest(keys);
  const longestFlag = longest(
    keys.reduce((arr, key) => arr.concat(Object.keys(data[key].flags)), [])
  );

  write(`${name} (version: ${paint(version, accent)})`);
  write(...block(0, description).map(line => paint(line, accent)));
  write('');

  if (!specific) header('Commands');
  else header('Command');

  keys.forEach(function listCommand(method) {
    if (specific && method !== specific) return;

    const command = data[method];
    const cmdFlags = command.flags;
    const name = paint(method.padEnd(longestCommand, ' '), accent);
    const cmdDesc = specific ? command.description.join(' ') : command.description[0];

    write(...block(longestCommand + prefix, cmdDesc, {
      length: method.length,
      prefix: name
    }));

    Object.keys(cmdFlags).forEach(function listFlags(prop) {
      const indent = longestFlag + longestCommand + (prefix * 2);

      let flagDesc = specific ? cmdFlags[prop].join(' ') : cmdFlags[prop][0];
      const flag = paint(prop.padStart(longestCommand + prefix), subtile);

      //
      // We assume that the CLI flags are 1on1 match with our provided default
      // flags. But we want to remove some common prefixes first.
      //
      const clean = prop.replace(/^--(no-|disable-)?/, '');
      if (specific && clean in flags) {
        flagDesc += ' Current value: '+ paint(flags[clean].toString(), accent);
      }

      write(...block(indent, flagDesc, {
        position: longestCommand + prefix,
        length: prop.length,
        prefix: flag
      }));
    });

    write('');

    //
    // Use did not request more detailed information, so lets bail out.
    //
    if (!specific) return;
    if (command.examples && command.examples.length) {
      header('Examples');

      command.examples.forEach(function listExamples(code) {
        example(paint(code, subtile));
      });

      write('');
    }

    if (command.debug) {
      header('Debugging');
      write('Additional debug information for this command be found by starting it with DEBUG');
      write('environment flag:');
      write('');
      example(paint('DEBUG='+ command.debug, accent) + paint(` ${name} ${method} # The rest of you CLI flags here`, subtile));
      write('');
    }
  });

  if (!specific) {
    header('Learn More');
    write('Each command has additional information available, you can find this by running:');
    write('');
    example(paint(`${name} help `, subtile) + paint('<command>', accent));
    write('');
    write('Where '+ paint('<command>', accent) +' is the command you want to learn more of.');
  }

  return output();
}

//
// Expose our helper functions for testing, using any of these methods will
// result in unwanted breaking changes in your code, do not use.
//
help.longest = longest;
help.writer = writer;
help.block = block;

module.exports = help;
