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
      iconName: 'fas fa-random'
    });

    // Settings
    
    await joplin.settings.registerSettings({
      'showToolBarIcon': {
        value: true,
        type: SettingItemType.Bool,
        section: 'openRandomNoteSection',
        label: 'Show Tool Bar Button',
        public: true,
        description: 'Alternative to using Hotkeys to open random notes'
      }, 
      
      'useCustomHotkey': {
        value: false,
        type: SettingItemType.Bool,
        section: 'openRandomNoteSection',
        label: 'Use Custom Hotkey',
        public: true,
        description: 'Enter custom hotkey after selecting this option'
      },

      'customHotkey': {
        value: 'Ctrl+Alt+R',
        type: SettingItemType.String,
        section: 'openRandomNoteSection',
        public: true,
        description: 'Separate your keys with a +',
        label: 'Enter Custom Hotkey',
      }
      
    })

    // Commands
    await joplin.commands.register({
      name: 'openRandomNote',
      label: 'Open a random note',
      iconName: 'fas fa-random',
      execute: async () => {
        let notesPerPage;
        let notes = [];
        let pageNumber = 1;

        // get all notes
        do {
          notesPerPage = await joplin.data.get(["notes"],  {
            page: pageNumber++,
            limit: 100,
          })
  
          notes.push(notesPerPage);
  
        } while(notesPerPage.has_more != false);

       
        const noteIndex = Math.floor(Math.random() * notes.length);

        // If notes exist in vault

        if (notes[noteIndex].items) {
          // deconstructing the notes array
          let simp_notes = [];
          notes.forEach(el => {
            console.log(el.items);

            el.items.forEach(element => {
              simp_notes.push(element)
            })

          }); 

          // get current note
          const currentNote = await joplin.workspace.selectedNote();

          // excluding currently selected note
          const filteredNotes = simp_notes.filter((note) => {
            if (currentNote.id != note.id) {
              return note;
            }
          });

          // console.log('filtered notes;', filteredNotes);
          
          // calculating a random note id
          const randomNoteId = Math.floor(Math.random() * filteredNotes.length);
          console.log('random id', randomNoteId);
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

    function validate(customHotKey) {
      if (customHotKey != '' || customHotKey != ' ') {
        // Regex to get all whitespace
        const regex = /\s+/g;
        let validatedHotKeys;
        const cleanWhiteSpace = customHotKey.replace(regex, '');
        const spaceCustom = cleanWhiteSpace.replace(/\+/g, ' ');

        const keySplit = spaceCustom.split(' ');

        const wordValidate = keySplit.map((word) => {
          return (word = word[0].toUpperCase() + word.substr(1));
        });

        validatedHotKeys = wordValidate.join('+');
        return validatedHotKeys;
      }
    }

    let key;

    if (useCustomHotKey === false) {
      key = defualtAccelerator;
    } else {
      if (customHotKey.length > 0) {
        key = validate(customHotKey);
      } else {
        await joplin.settings.setValue('customHotkey', defualtAccelerator);
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
