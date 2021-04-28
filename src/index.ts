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

    let useCustomHotKey = await joplin.settings.value('useCustomHotkey');

    const defualtAccelerator = 'Ctrl+Alt+R';
    let accelerator = '';
    const customHotKey = await joplin.settings.value('customHotkey');

    // if custom hotkey option is true but no hotkey entered
    if (useCustomHotKey === false && useDefualtHotKey === false) {
      await joplin.settings.setValue('defualtHotkey', true);
      alert(
        `Defualt hotkey will be used for the Random note Plugin:  ${defualtAccelerator}`
      );
      accelerator = defualtAccelerator;
    } else if (useCustomHotKey && useDefualtHotKey) {
      if (customHotKey.length > 0) {
        accelerator = customHotKey;
      } else {
        await joplin.settings.setValue('defualtHotkey', true);
        alert(
          `Custom Hotkey not specified, Defualt hotkey will be used for opening Random notes: ${defualtAccelerator}`
        );
        accelerator = defualtAccelerator;
      }
    } else if (useDefualtHotKey === false && useCustomHotKey) {
      if (customHotKey.length > 0) {
        await joplin.settings.setValue('customHotkey', '');
        accelerator = customHotKey;
      } else {
        await joplin.settings.setValue('defualtHotkey', true);
        alert(
          `Custom Hotkey not specified, Defualt hotkey will be used for opening Random notes: ${defualtAccelerator}`
        );
        accelerator = defualtAccelerator;
      }
    }

    // validate custom hot key

    console.log(
      'defualt key',
      useDefualtHotKey,
      'which is ',
      defualtAccelerator
    );
    console.log('custom key', customHotKey);
    alert(`Testing alert shemacs: ${defualtAccelerator}`);

    await joplin.views.menuItems.create(
      'openRandomNoteMenu',
      'openRandomNote',
      MenuItemLocation.Tools,
      // create custom hotkey
      { accelerator: accelerator }
    );
  },
});
