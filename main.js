(function () {
  'use strict';
  var dragged,
      dragStart, drag, dragEnd,
      getNoteObject,
      grabY, grabX,
      createNote,
      addNoteBtn,
      onAddNoteBtnClick,
      saveNote, deleteNote,
      loadNotes,
      init,
      testLocalStorage;
  dragStart = function (ev) {
    let boundingClientRect;
    if (ev.target.className.indexOf('bar') === -1) {
      return;
    }
    dragged = this;
    boundingClientRect = dragged.getBoundingClientRect();
    grabY = boundingClientRect.top - ev.clientY;
    grabX = boundingClientRect.left - ev.clientX;
  };
  drag = function (ev) {
    if (!dragged) {
      return;
    }
    let posX = ev.clientX + grabX,
        posY = ev.clientY + grabY;
    if (posX < 0) {
      posX = 0;
    }
    if (posY < 0) {
      posY = 0;
    }
    dragged.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
  };
  dragEnd = function () {
    dragged = null;
    grabX = null;
    grabY = null;
  };
  getNoteObject = function (el) {
    let textarea = el.querySelector('textarea');
    return {
      transformCSSValue: el.style.transform,
      content: textarea.value,
      id: el.id,
      textarea: {
        width: textarea.style.width,
        height: textarea.style.height,
      }
    };
  };
  onAddNoteBtnClick = function () {
    createNote();
  };
  createNote = function (options) {
    let sticker = document.createElement('div'),
        bar = document.createElement('div'),
        saveBtn = document.createElement('button'),
        deleteBtn = document.createElement('button'),
        textarea = document.createElement('textarea'),
        BOUNDARIES = 400,
        noteConfig = options || {
          transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)",
          content: '',
          id: "sticker_" + new Date().getTime(),
        },
        onSave,
        onDelete;
    if (noteConfig.textarea) {
      textarea.style.width = noteConfig.textarea.width;
      textarea.style.height = noteConfig.textarea.height;
      textarea.style.resize = 'none';
    }
    onSave = function () {
      saveNote(
        getNoteObject(sticker)
      );
    };
    onDelete = function () {
      if (confirm('Are you sure you want to delete that note?')) {
        deleteNote(
          getNoteObject(sticker)
        );
        document.body.removeChild(sticker);
      } else {
        // Do nothing!
      }
    };
    sticker.style.transform = noteConfig.transformCSSValue;
    sticker.id = noteConfig.id;
    textarea.value = noteConfig.content;
    saveBtn.classList.add('saveBtn');
    saveBtn.addEventListener('click', onSave, false);
    deleteBtn.classList.add('delBtn');
    deleteBtn.addEventListener('click', onDelete, false);
    bar.classList.add('bar');
    sticker.classList.add('sticker');
    bar.appendChild(saveBtn);
    bar.appendChild(deleteBtn);
    sticker.appendChild(bar);
    sticker.appendChild(textarea);
    sticker.addEventListener('mousedown', dragStart, false);
    document.body.appendChild(sticker);
  };
  testLocalStorage = function () {
    var foo = 'foo';
    try {
      localStorage.setItem(foo, foo);
      localStorage.removeItem(foo);
      return true;
    } catch (e) {
      return false;
    }
  };
  init = function () {
    if (!testLocalStorage) {
      var message = "We are sorry but you cannot use localStorage";
      saveNote = function () {
        console.warn(message);
      };
      deleteNote = function () {
        console.warn(message);
      };
    } else {
      saveNote = function (note) {
        localStorage.setItem(note.id, JSON.stringify(note));
      };
      deleteNote = function (note) {
        localStorage.removeItem(note.id);
      };
      loadNotes = function () {
        for(var i = 0; i < localStorage.length; i++) {
          var noteObject = JSON.parse(
            localStorage.getItem(
              localStorage.key(i)
            )
          );
          createNote(noteObject);
        };
      };
      loadNotes();
    }
    addNoteBtn = document.querySelector('.addNoteBtn');
    addNoteBtn.addEventListener('click', onAddNoteBtnClick, false);
    document.addEventListener('mousemove', drag, false);
    document.addEventListener('mouseup', dragEnd, false);
  };
  init();
})();
