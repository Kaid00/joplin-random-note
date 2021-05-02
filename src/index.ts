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
    // await joplin.settings.registerSetting('defualtHotkey', {
    //   value: true,
    //   type: SettingItemType.Bool,
    //   section: 'openRandomNoteSection',
    //   label: 'Ctrl+Alt+R',
    //   public: true,
    //   description: 'Use Defualt Hotkey',
    // });

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

    //Commands
    await joplin.commands.register({
      name: 'openRandomNote',
      label: 'Open a random note',

      execute: async () => {
        // get all notes
        const notes = await joplin.data.get(['notes'], { field: ['id'] });
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

          // open random note
          await joplin.commands.execute(
            'openNote',
            filteredNotes[randomNoteId].id
          );
        }
      },
    });

    // Get Options
    let useCustomHotKey = await joplin.settings.value('useCustomHotkey');

    const customHotKey = await joplin.settings.value('customHotkey');

    const defualtAccelerator = 'Ctrl+Alt+R';

    // validating custom hotkey
    const regex = /\s+/g;

    // removing whitespace if there is from custom key
    const whiteSpaceClean = customHotKey.replace(regex, '');
    const spaceCustom = whiteSpaceClean.replace(/\+/g, ' ');
    const keySplit = spaceCustom.split(' ');

    const wordValidate = keySplit.map((word) => {
      return (word = word[0].toUpperCase() + word.substr(1));
    });

    const validatedHotKeys = wordValidate.join('+');

    let test = '3';

    // if custom hotkey option is true but no hotkey entered
    if (useCustomHotKey === false) {
      // await joplin.settings.setValue('defualtHotkey', true);

      alert(
        `Defualt hotkey will be used for the Random note Plugin:  ${defualtAccelerator}`
      );

      test = defualtAccelerator;
    } else {
      if (customHotKey.length > 0 && customHotKey != ' ') {
        test = validatedHotKeys;
        alert(`what we use, ${whiteSpaceClean}`);
      } else {
        // await joplin.settings.setValue('defualtHotkey', true);
        alert(
          `Custom Hotkey not specified, Defualt hotkey will be used for opening Random notes: ${defualtAccelerator}`
        );

        test = defualtAccelerator;
        // await joplin.settings.setValue('defualtHotkey', false);
      }
    }

    console.log('custom key', customHotKey);
    console.log('test key', test);

    console.log('Use custom key', useCustomHotKey);
    console.log('defualt key', defualtAccelerator);

    // let useDefualtHotKey = await joplin.settings.value('defualtHotkey');

    await joplin.views.menuItems.create(
      'openRandomNoteMenu',
      'openRandomNote',
      MenuItemLocation.EditorContextMenu,
      { accelerator: test }
    );

    await joplin.views.menus.create('myMenu', 'Open Random Note', [
      {
        commandName: 'openRandomNote',
        accelerator: test,
      },
    ]);
    await joplin.views.toolbarButtons.create(
      'openRandomNoteMenuViaToolbar',
      'openRandomNote',
      ToolbarButtonLocation.EditorToolbar
    );
  },
});
