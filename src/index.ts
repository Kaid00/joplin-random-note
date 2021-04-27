import joplin from "api";
import { MenuItemLocation, ToolbarButtonLocation } from "api/types";

joplin.plugins.register({
  onStart: async function () {
    // Create Command
    await joplin.commands.register({
      name: "openRandomNote",
      label: "Open a random note from vault",
      execute: async () => {
        // get all notes
        const notes = await joplin.data.get(["notes"], { field: ["id"] });
        // Open random note
        console.log("Initial note ary: ", notes.items);
        if (notes.items) {
          // get current note
          const currentNote = await joplin.workspace.selectedNote();

          console.log("Current note: ", currentNote.id);
          // excludes currently selected note
          const filteredNotes = notes.items.filter((note) => {
            if (currentNote.id != note.id) {
              return note;
            }
          });

          console.log("filtered note ary: ", filteredNotes);

          // random note id
          const randomNoteId = Math.floor(Math.random() * filteredNotes.length);

          console.log("Random note : ", filteredNotes[randomNoteId].id);
          // open random note
          await joplin.commands.execute(
            "openNote",
            filteredNotes[randomNoteId].id
          );
        }
      },
    });

    await joplin.views.menuItems.create(
      "openRandomNoteMenu",
      "openRandomNote",
      MenuItemLocation.Tools,
      { accelerator: "Ctrl+Alt+P+O" }
    );
  },
});
