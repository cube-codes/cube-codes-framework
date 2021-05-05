# Cube Codes IDE - Editor

## Usage

Within the editor of the IDE the interface {@link EditorApi} is imported to the global namespace. This means in the editor you can simply write:

```javascript
// Reading from the CubeApi asking whether the cube is solved
const s = CUBE.isSolved();

// Writing to the CubeApi turning the cube's front face
await CUBE.front();

// Digging into the cubelets via the CubeletInspector to find
// the current location of the cubelet that should be at the front-right edge
const l = CUBELETS.findSolvedInPart(CubePart.FR).currentLocation;

// Interacting with the UI to send out a log message
UI.log('Hi, I am here');
```

## Asynchronous cube changes

All functions that change the cube are asynchronous. This means that they do not execute and then return to the parent code, but they return immediately a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | Promise} and execute the code parallel to your parent code. If you want to wait until the changes to the cube are done (which you will want almost always) before your parent code should execute, you must prefix the function invocation with the keyword `await`.