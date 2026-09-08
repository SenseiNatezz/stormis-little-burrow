# Stormi’s little burrow

A Three.js + Vite miniature life simulator inspired by the supplied photograph of Stormi: black floppy ears, a white muzzle and blaze, little pink bows, and a flower collar.

## Run locally

Install Node.js 22.13 or newer, then open a terminal in this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Source changes appear through hot reload.

```sh
npm run build
npm start
```

The production files are written to `dist/`. `npm start` previews that build.

## Controls

- Drag to rotate; scroll or pinch to zoom.
- Click furniture or use the Japanese activity buttons to cook, eat, read, nap, or clean.
- The おまかせ switch enables random routines. Switch it off to keep the selected activity.
- Pause freezes movement and animation. The camera remains available.
- Keyboard: Space pauses, + and − zoom, R resets the view. All action buttons support normal keyboard navigation.
- Reduced-motion preferences start the world paused; press play to begin.

## Extend the world

- `src/model.js`: rounded geometry helpers and Stormi’s articulated character rig.
- `src/furniture.js`: room construction and the `furnitureBuilders` registry. Each builder returns a group; its action ID is applied automatically for raycast selection.
- `src/actions.js`: declarative activity names, targets, facing directions and durations, plus the movement / random-choice director.
- `src/main.js`: renderer, UI, input, and activity animation poses and props.
- `src/style.css`: responsive Japanese-inspired interface.

To add an activity, register the same ID in `actions` and `furnitureBuilders`, then add its prop and animation in `main.js`. Targets use world X/Z coordinates. The dog faces local +Z; `face` is rotation around Y in radians.

The scene is made from procedural 3D geometry and a generated wood-grain canvas texture. The original photo appears in the profile badge and remains in `public/stormi-reference.png`. No external model downloads or API keys are required. Google Fonts is optional; local font fallbacks keep the interface usable offline after dependencies are installed.

This is a browser simulation: activities are cosmetic and no state is sent to a server. WebGL is required. There is no saved game, pathfinding around arbitrary new furniture, or audio.
