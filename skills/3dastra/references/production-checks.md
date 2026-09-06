# Production checks

Read when turning references into geometry and materials. Apply only the checks relevant to the deliverable.

## Inspect image properties

The included utility requires Python 3 and Pillow. Use an environment that already has the dependency or the project's authorized environment; do not silently modify another application's runtime.

```text
python /path/to/3dastra/scripts/inspect_image.py /path/to/leaf.png
python /path/to/3dastra/scripts/inspect_image.py /path/to/leaf.png --alpha-threshold 128 --output /path/to/audit.json
```

Replace example paths with actual files. The utility reads the image without editing it, prints JSON, and writes a report only with `--output`. An existing report may be replaced; use versioned report names to preserve it. File output must end in `.json` and cannot be the input image.

| Field | Meaning |
| --- | --- |
| `size`, `mode`, `format` | Actual delivered dimensions and file properties, regardless of the prompt. |
| `sha256` | Fingerprint of the inspected source bytes. |
| `alpha.present` | An alpha channel or transparency information exists; this does not prove a useful cutout. |
| `transparent_pixels`, `opaque_pixels`, `partial_pixels` | Counts of alpha 0, 255, and intermediate values after an 8-bit conversion. |
| `threshold_bbox` | Bounds of pixels at or above the threshold. Right and bottom edges are exclusive. |
| `threshold_uv_top_left` | The same rectangle normalized, with a top-left origin. Adapt to the renderer's UV convention. |
| `edges.*_rgb_mae` | Mean absolute RGB difference between opposite edges, in 8-bit values, without alpha weighting. |
| `visual_quality_verdict` | Always `null`; the utility does not judge appearance, tiling, or material suitability. |

A fully transparent image can have `null` bounds. An RGB image can depict a checkerboard without containing transparency. Zero edge difference does not prove good visual tiling: internal lines, gradients, or repetition can still reveal a seam. Inspect tiled and applied materials as well as the numbers. Multi-frame images are rejected; provide one frame separately.

## From image to material

1. Inspect the original for residue, margins, and baked lighting. Use the appropriate image tool for corrections.
2. Confirm actual dimensions and usable bounds rather than stretching a silhouette to arbitrary UVs.
3. Check orientation, repetition, and scale on a test surface and on the object.
4. Configure color and data maps according to the renderer's conventions. Verify normal orientation, channels, and the actual export.
5. Inspect cutouts close up and at a distance. Filtering, mips, edges, and alpha thresholds can change perceived density.
6. Check under the intended lights. A strong painted shadow can remain where dynamic lighting would not justify it.

Keep originals, prepared files, and editable materials separately. Make compression and resolution changes explicit, and compare again when they affect appearance.

## From silhouette to mesh

Start with simple volumes. Compare frame coverage, relative width and height, visual mass, negative spaces, and ground contact. Surface microdetail does not fix incorrect proportions.

| Need | Construction option | Verify |
| --- | --- | --- |
| A part changes the outline or will be viewed close up | Enough geometry for the intended angles | Silhouette, faceting, and intersections in the final camera. |
| Repeated elements | Shared geometry and instances where appropriate | Variation, actual cost, and selection behavior. |
| Small cutouts | Simple geometry with alpha when suitable | Orientation, sorting, occlusion, and overlapping-fragment cost. |
| Distant background | Simplified geometry or a disclosed hybrid approach | Lateral movement does not reveal an unsuitable flat surface. |
| Joint, cavity, or supported object | Consistent volume and physical contact | Shadow, depth, and connection from more than one angle. |

Choose by function and measured cost, without universal polygon, leaf, texture, or light counts. A museum, a character, and a forest can share the process without sharing assets.

## Export and integrate

Open the export in the destination and check scale, orientation, materials, textures, required parts, and animations. Test the camera and selection against the exported object. Distinguish **built in the modeler**, **exported**, **loaded in the destination**, and **visually inspected**. Mark only steps that actually happened.
