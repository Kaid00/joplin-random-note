import joplin from 'api';
import {
  MenuItemLocation,
  ToolbarButtonLocation,
  SettingItemType,
} from 'api/types';

joplin.plugins.register({
  onStart: async function () {
    //Registering  Section
    await joplin.settings.registerSection('openRandomNoteSection', {
      label: 'Random Note',
      iconName: 'fas fa-random',
    });

    // Settings
    await joplin.settings.registerSetting('showToolBarIcon', {
      value: true,
      type: SettingItemType.Bool,
      section: 'openRandomNoteSection',
      label: 'Show Tool Bar Button',
      public: true,
      description: 'Alternative to using Hotkeys to open random notes',
    });

    await joplin.settings.registerSetting('useCustomHotkey', {
      value: false,
      type: SettingItemType.Bool,
      section: 'openRandomNoteSection',
      label: 'Use Custom Hotkey',
      public: true,
      description: 'Enter custom hotkey after selecting this option',
    });

    await joplin.settings.registerSetting('customHotkey', {
      value: '',
      type: SettingItemType.String,
      section: 'openRandomNoteSection',
      public: true,
      description: 'Separate your keys with a +',
      label: 'Enter Custom Hotkey',
    });

    // Commands
    await joplin.commands.register({
      name: 'openRandomNote',
      label: 'Open a random note',
      iconName: 'fas fa-random',
      execute: async () => {
        // get all notes
        const notes = await joplin.data.get(['notes'], { field: ['id'] });
        // If notes exist in vault
        if (notes.items) {
          // get current note
          const currentNote = await joplin.workspace.selectedNote();

          // excludes currently selected note
          const filteredNotes = notes.items.filter((note) => {
            if (currentNote.id != note.id) {
              return note;
            }
          });

          // calculating a random note id
          const randomNoteId = Math.floor(Math.random() * filteredNotes.length);

          await joplin.commands.execute(
            'openNote',
            filteredNotes[randomNoteId].id
          );
        }
      },
    });

    // Get Settings Options
    let useCustomHotKey = await joplin.settings.value('useCustomHotkey');

    const customHotKey = await joplin.settings.value('customHotkey');
    const toolBarDecision = await joplin.settings.value('showToolBarIcon');

    const defualtAccelerator = 'Ctrl+Alt+R';

    // validating custom hotkey
    // Regex to get all whitespace
    const regex = /\s+/g;

    const cleanWhiteSpace = customHotKey.replace(regex, '');
    const spaceCustom = cleanWhiteSpace.replace(/\+/g, ' ');

    const keySplit = spaceCustom.split(' ');

    const wordValidate = keySplit.map((word) => {
      return (word = word[0].toUpperCase() + word.substr(1));
    });

    const validatedHotKeys = wordValidate.join('+');

    let key;

    if (useCustomHotKey === false) {
      key = defualtAccelerator;
    } else {
      if (customHotKey.length > 0 && customHotKey != ' ') {
        key = validatedHotKeys;
      } else {
        key = defualtAccelerator;
      }
    }

    await joplin.views.menuItems.create(
      'openRandomNoteMenu',
      'openRandomNote',
      MenuItemLocation.EditorContextMenu,
      { accelerator: key }
    );

    await joplin.views.menus.create('myMenu', 'Open Random Note', [
      {
        commandName: 'openRandomNote',
        accelerator: key,
      },
    ]);

    if (toolBarDecision) {
      await joplin.views.toolbarButtons.create(
        'openRandomNoteMenuViaToolbar',
        'openRandomNote',
        ToolbarButtonLocation.EditorToolbar
      );
    }
  },
});
