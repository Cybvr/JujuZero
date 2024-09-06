const fs = require('fs-extra');
const path = require('path');

const sourcePath = path.join(__dirname, 'node_modules', 'tinymce', 'skins');
const destPath = path.join(__dirname, 'public', 'tinymce', 'skins');

fs.copy(sourcePath, destPath, (err) => {
  if (err) {
    console.error('An error occurred while copying the folder.', err);
  } else {
    console.log('TinyMCE skins folder copied successfully!');
  }
});