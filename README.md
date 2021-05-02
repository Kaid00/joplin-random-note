# Joplin Random Note

The plugin opens a note at random from your vault, after installing the plugin you can create a custom hotkey that opens a note at random, or use the defualt hotkey `Ctrl+Alt+R`

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#usage)
- [Building the plugin](#Building-the-plugin)
- [License](#license)

## Installation

- Open Joplin and navigate to `Preferences > Plugins`
- Search for `Random note` and click on install
- Restart Joplin to enable the plugin

### Uninstall

- Open Joplin and navigate to `Tools > Options > Plugins`
- Search for the `Random Note` plugin
- Press `Delete` to remove the plugin completely
  - Alternatively you can also disable the plugin by clicking on the toggle button
- Restart Joplin

## Usage

### Defualt Hotkey

By defualt you can use the hotkey `Ctrl+Alt+R` to open a random note

### Tool bar button

Click on the 🔀 icon to open a random note

### Set Hotkey

- Open Joplin and navigate to `Preferences > Plugins Settings
- Select Random Note, you will find the following options
- `Show Tool Bar Button` Shows Random Note icon on tool bar for quick shortcut to open random note
- `Use Custom Hotkey` Select this option if you want to use a custom hotkey to open random notes
- `Enter Custom Hotkey` Enter your custom Hotkey
- Click `Apply` when done, and restart Joplin for changes to take effect

## Development

The npm package of the plugin can be found [here](https://www.npmjs.com/package/joplin-plugin-random-note).

### Building the plugin

If you want to build the plugin by your own simply run `npm run dist`.

### Install Built plugin

- Open Joplin **Configuration > Plugins** section
- Under Advanced Settings, add the plugin path in the **Development plugins** text field.
- This should be the path to your main plugin directory, i.e. `path/to/your/root/plugin/directory`.

### Updating the plugin framework

To update the plugin framework, run `npm run update`.

## Roadmap

- [x] Open Random Note
- [ ] Open Tagged Random Note

## License

Copyright (c) 2021 Azamah Junior

MIT License. See [LICENSE](./LICENSE) for more information.
