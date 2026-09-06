# Prompts and production references

Read when generating concepts or preparing modeling references. Adapt these examples to the subject, function, and available tools. Fields in braces are project inputs.

## Match the reference to the decision

| Reference | What it resolves | Check before use |
| --- | --- | --- |
| Overall image | Style, composition, scale, and lighting | Does the framing work with the intended interface and interaction? |
| Construction views | Depth, silhouette, and continuity | Do the views describe the same object? |
| Assembly detail | Joints, cavities, stems, attachments, or ground contact | Does the connection work in 3D from the required angles? |
| Surface study | Detail scale, edges, color variation, and lighting response | Is it an appearance reference or a map ready to apply? |
| Color map | Surface color without incompatible directional lighting | Is the file clean and at the correct scale and actual dimensions? |
| Lighting study | One object's appearance in different states | Are identity and geometry still consistent? |

## Explore a direction

Use a separate generation per alternative when that makes comparison clearer, respecting the generator's capabilities. Keep subject and camera comparable so the user can distinguish a style choice from a composition change.

```text
Create a concept image of {object or scene} for {use and interaction}.
Preserve {required content, essential proportions, framing, and interface space}.
This alternative's direction: {shape, edge, surface, and lighting treatment}.
The image should communicate {intent} and support {intended views}.
Constraints: {elements required or rejected by the user}.
Show a coherent scene with physical contacts and clear visual hierarchy.
```

Choose observable qualities. "Perfect," "premium," and "more realistic" do not specify relief scale, silhouette, or lighting. Pair style terms with concrete decisions.

## Derive views from the target

Supply the chosen file through the tool's documented reference mechanism. Keep the main view authoritative when derived views conflict.

```text
Use the attached image as the identity and proportion target for {object}.
Produce {side, rear, top, or required detail view} to clarify
{specific construction question}. Preserve {parts and visual characteristics}.
Keep scale comparable and use a simple background for silhouette readability.
Do not introduce new elements or change the style.
```

Pixels are not certified physical measurements. Set consistent scale and depth in the model and document what was inferred outside the approved view. Resolve ambiguities that materially affect the appearance before detailing that part.

## Generate a color map

```text
Create only the color map for {material}, in the style of {target}.
Flat view, surface filling the frame, no perspective, captions, frame,
or demonstration objects. Neutral lighting, no cast shadow or strong
directional highlight. Detail scale: {intended scale}.
{If needed: continuity between opposite edges for tiling.}
Requested file: {format, dimensions, and actual alpha requirement}.
```

For a cutout, specify silhouette, view, margins, and transparency. Inspect the delivered file: requesting alpha or a particular size does not prove they were delivered. If baked shadows are an intentional part of a painted material, record the decision and check compatibility with dynamic lighting.

Color, roughness, normal maps, and masks serve different roles. Do not present independently generated images as a coherent PBR set before inspecting the applied material.

## Make a focused correction

```text
Use {target image} as the main reference and {current capture} as the
implementation state. The priority mismatch is {visible, localized difference}.
Preserve {already approved characteristics}. Adjust {relevant variable}
to achieve {observable result}. Check again in {required views}.
```

When supplying two images, identify each one's role. A current capture documents the mismatch; it does not automatically replace the target.

## Keep a minimal generation record

Save the original file, its role, reference source, available prompt, version, and the decision it helped resolve. A name such as `02-side-joint-v1.png` explains the purpose better than `final-perfect.png`. Keep important files in a durable project directory.
