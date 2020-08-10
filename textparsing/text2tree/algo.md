read the file contents

split into lines

filter out empty lines

use a stack to maintain ancestor context

first line is the root

create a root node

add it to the stack, because subsequent additions will happen to the node that is on top of the stack

from second line onwards, for each line 

  calculate the stack length ( depth of the tree we are at )
  calculate the depth of the line : find number of white spaces before the line, ( divide by 2 if tab is 2 spaces, etc.)
  
  from here 3 conditions
  
  siblings
  
    if depth  == line depth
    
    pop from stack // this is the current child
    
    pop again to get the parent
    
    add this line as new child node to this parent
    
    push parent 
    
    push this node
    
  children
  
    if depth < line depth
    
    pop stack to get parent
      
    add this line as new child node to this parent
    
    push parent 
    
    push this node
  
  ancestor/parent next level
    
    if depth > line depth
     
    pop until the depth and line depth are equal
     
    now we are at sibling condition
     
    pop to get parent
     
    add this line as new child node to this parent
    
    push parent 
    
    push this node
    
     
