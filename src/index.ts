import joplin from 'api';
import {
  MenuItemLocation,
  ToolbarButtonLocation,
  SettingItemType,
} from 'api/types';
import { settings } from 'node:cluster';

joplin.plugins.register({
  onStart: async function () {
    // Registering Settings Section
    await joplin.settings.registerSection('openRandomNoteSection', {
      label: 'Random Note',
      iconName: 'fas fa-random',
    });

    // separate each key with a space
    // Use Defualt Hotkey
    await joplin.settings.registerSetting('defualtHotkey', {
      value: true,
      type: SettingItemType.Bool,
      section: 'openRandomNoteSection',
      label: 'Ctrl+Alt+R',
      public: true,
      description: 'Use Defualt Hotkey',
    });

    await joplin.settings.registerSetting('customHotkey', {
      value: '',
      type: SettingItemType.String,
      section: 'openRandomNoteSection',
      public: true,
      description: 'Set a custom hotkey to open random notes from your vault',
      label: 'Create Custom Hotkey',
    });

    // Create Command
    await joplin.commands.register({
      name: 'openRandomNote',
      label: 'Open a random note from vault',
      execute: async () => {
        // get all notes
        const notes = await joplin.data.get(['notes'], { field: ['id'] });
        // Open random note
        console.log('Initial note ary: ', notes.items);
        if (notes.items) {
          // get current note
          const currentNote = await joplin.workspace.selectedNote();

          // excludes currently selected note
          const filteredNotes = notes.items.filter((note) => {
            if (currentNote.id != note.id) {
              return note;
            }
          });

          // random note id
          const randomNoteId = Math.floor(Math.random() * filteredNotes.length);

          console.log('Random note : ', filteredNotes[randomNoteId].id);
          // open random note
          await joplin.commands.execute(
            'openNote',
            filteredNotes[randomNoteId].id
          );
        }
      },
    });

    // Get Options
    let useDefualtHotKey = await joplin.settings.value('defualtHotkey');
    const defualtAccelerator = 'Ctrl+Alt+R';
    let accelerator = '';
    const customHotKey = await joplin.settings.value('customHotkey');
    if (customHotKey.length === 0 && useDefualtHotKey === false) {
      useDefualtHotKey = true;
      accelerator = defualtAccelerator;
    }
    // validate custom hot key

    if (useDefualtHotKey === true && customHotKey.length > 0) {
      useDefualtHotKey = false;
      accelerator = customHotKey;
    }

    if (useDefualtHotKey && customHotKey.length === 0) {
      accelerator = defualtAccelerator;
    }

    if (customHotKey.length > 0) {
      accelerator = customHotKey;
    }

    await joplin.views.menuItems.create(
      'openRandomNoteMenu',
      'openRandomNote',
      MenuItemLocation.Tools,
      // create custom hotkey
      { accelerator: accelerator }
    );

    console.log('custom hotkey: ', customHotKey);
    console.log('defualt hotkey: ', useDefualtHotKey);
  },
});
