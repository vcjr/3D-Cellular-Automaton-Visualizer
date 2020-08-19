
// Conways Automatons Rule Set
/*
  Alive Cell:
    - Cell's with one or no neighbords dies from solitude
    - Cell's with four or more neighbors dies from overpopulation
    - Cell's with two or three neighbors survive

  Dead Cell:
    - Cell's with three neighbors become populated
*/
const conways = {
  alive: [
    {"neighbors": "<= 1"}, 
    {"neighbors": ">= 4"}  
  ] ,
  dead: [
    {"neighbors": "=== 3"}
  ]
};

const victors = {};

const ruleSets = [conways, victors];