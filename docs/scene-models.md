# Original scene models

Status: experimental and not approved for the public design. The 2026-10-10 review found that the models and mixed visual styles do not explain the event clearly. Preserve these assets for reference; follow `website-redesign-plan.md` before extending their use. The public pages now use the original 2D illustrations directly. The optional `SceneVisual` component is retained for experiments and defaults to 2D.

Four original procedural scenes are available: a workbench, a project demonstration, a shared room with two beds, and a meal tray. They express the activity experience; they do not depict a confirmed venue, hotel, menu, project or equipment inventory.

The existing SVG and CSS illustrations remain unchanged. If used in a future experiment, `SceneVisual` loads `SceneCanvas` only after 3D is explicitly selected and the component approaches the viewport. Browsers without WebGL, shader failures and lost contexts fall back to 2D. The scene frame keeps the same dimensions while loading and switching modes.

## Interaction and rendering

- Desktop: drag to rotate and tilt; arrow keys rotate and tilt; Home resets the view.
- Mobile: horizontal dragging rotates, while vertical touch movement remains available for page scrolling. Visible left, reset and right buttons are an alternative to dragging.
- The renderer draws on initial display, resize, theme changes and direct interaction. There is no automatic spinning or continuous rendering loop. Reduced motion does not remove content or controls.
- Models use theme-specific colours, directional shading, a depth buffer and an orthographic view that fits the rotated scene bounds. Device pixel ratio is capped at 1.75.
- Render resources and observers are released when the scene unmounts. A 3D-to-2D switch releases that scene's WebGL resources.

No 3D library, textures, external models or new runtime dependencies were added. In the earlier experimental build, the renderer and procedural geometry formed a separate lazy-loaded chunk of about 10 KB before compression. The current public build does not include that runtime chunk.

## Reusable files

`npm run models:export` generates glTF 2.0 binary files in `public/assets/models/`: `room.glb`, `workbench.glb`, `meal.glb` and `demo.glb`. Each contains geometry, normals, vertex colours and a simple rough PBR material. These files can be opened in glTF-compatible tools for later art direction. The browser renderer uses the procedural geometry directly and does not download these GLB files.

`npm run test:scenes` checks that every scene in both palettes contains complete triangles, finite coordinates, valid normals and valid colours. Browser verification is still required to assess composition, rotation, fallback behaviour and mobile presentation.
