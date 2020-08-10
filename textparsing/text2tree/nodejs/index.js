const fs = require('fs');

function parseTextToJSON(textFilePath, callback) {

  // read the file contents

  fs.readFile(textFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {

      // Split the content into lines

      let lines = data.split('\n');

      // remove blank lines

      lines = lines.filter(line => line.trim().length != 0)


      convertToDocTree(lines, root => {
        convertToJSON(root, jsonNotes => {
          callback(jsonNotes);

        });
      });






    }
  });
}

function escapeHTML(notesText, callback) {
  notesText = notesText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\s/g, '&nbsp;');
  // console.log(data[2].match('^\S*'));
  fs.readFile('index.html', 'utf-8', (err, data) => {
    data = data.replace('replace_body', notesText);

    fs.writeFile('notes.html', data, 'utf-8', () => {

    });
  });
  callback(data);
}

async function convertToJSON(root, callback) {

  await buildJSON(root, jsonNotes => callback(jsonNotes));

}
async function buildJSON(node, callback) {
  let obj = {};
  obj['name'] = node.value;


  if (node.children.length > 0) {
    obj['children'] = [];
    await node.children.forEach(child => {
      buildJSON(child, data => {
        obj['children'].push(data);
      });
    });
  }

  callback(obj);

}


function convertToDocTree(lines, callback) {
  let tree = new Tree();
  tree.buildFrom(lines, root => callback(root));
}

class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
}

class Tree {
  constructor() {
    this.root = null;
    this.stack = [];
  }

  buildFrom(lines, callback) {
    //assign first line to root

    this.root = new Node(lines[0]);
    // add root top stack to maintain ancestor context
    this.stack.push(this.root);

    lines.shift(); // remove first line as its assigned to root
    if (lines.length == 0) {
      callback(this.root);
    } else
      this.build(lines, rootNode => callback(rootNode))

  }

  build(lines, callback) {
    lines.forEach((line, i) => {
      // depth of stack is the depth of tree built yet
      let depth = this.stack.length - 1; // do not count root as depth

      // find the white spaces befoe line( if tab 2 spaces divide by 2, default)
      let lineDepth = line.search(/\S/);
      lineDepth = lineDepth / 2;

      //console.log(`${i}, ${depth},${lineDepth}`);
      // Sibling
      if (depth == lineDepth) {
        // pop existing child
        this.stack.pop();

        // pop to get parent
        let parentNode = this.stack.pop();

        // add new node to parent as child
        let newChildNode = new Node(line.trim());
        parentNode.children.push(newChildNode);

        // push parent
        this.stack.push(parentNode);
        // push new child
        this.stack.push(newChildNode);

      } else
        // next level Parent
        if (lineDepth < depth) {
          while (depth - lineDepth != 0) {
            this.stack.pop();
            depth = this.stack.length;
          }
          // pop to get parent
          let parentNode = this.stack.pop();

          // add new node to parent as child
          let newChildNode = new Node(line.trim());
          parentNode.children.push(newChildNode);

          // push parent
          this.stack.push(parentNode);
          // push new child
          this.stack.push(newChildNode);

        } else
          // children
          if (lineDepth > depth) {
            // pop to get parent
            let parentNode = this.stack.pop();

            // add new node to parent as child
            let newChildNode = new Node(line.trim());
            parentNode.children.push(newChildNode);

            // push parent
            this.stack.push(parentNode);
            // push new child
            this.stack.push(newChildNode);
          }

      if (i == lines.length - 1) {
        // last line is processed, execute callback
        callback(this.root);

      }
    });
  }
}
parseTextToJSON('data.txt', data => console.log(JSON.stringify(data, null, 4)));
