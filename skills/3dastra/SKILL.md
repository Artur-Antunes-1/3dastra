---
name: 3dastra
description: "Use for visually directed 3D scenes or assets: concept art before modeling, reference-led refinement, and matching renders to a chosen image. Also applies to image-first Blender and real-time 3D workflows. Not for unrelated 2D UI work or purely technical 3D fixes."
license: MIT
---

# 3DASTRA

Turn visual intent into an observable target before adding detailed 3D geometry. Build from that target and compare captures from the final renderer throughout production. Respond in the user's language.

**Intent → images → chosen target → production references → volumes and camera → materials and lighting → comparison → performance.**

## Choose the entry point

Inspect the project, references, and existing decisions. Identify the authorized deliverable: concepts, an asset, a scene, a refinement, or a complete implementation.

| Situation | Next action |
| --- | --- |
| No visual direction, or previous models were visually unsatisfying | Produce concept images before detailing geometry. |
| A chosen image and permission to implement already exist | Reuse that target and address the next production decision. |
| The request is only for exploration | Deliver images and a comparison of alternatives; stop before modeling. |
| A local adjustment should preserve the style | Work on the affected stage and check for visual regressions. |

Reuse earlier approvals. Without an existing target or delegated art direction, present alternatives and obtain the user's choice before detailed modeling; continue independent work meanwhile. When the user delegates the choice, select a target, record why, and proceed. Resolve routine decisions without repeated approval requests.

An isolated technical fix does not require selecting this skill. If the skill is already active or explicitly invoked, use only the relevant part of the workflow.

## 1. Make the direction concrete

Record intent, interaction, required parts, rejected elements, camera views, and platform. Separate product rules from aesthetic preferences: implement an exact required count even if a generated image gets it wrong.

When a target is missing, use an available image-generation tool to create a small set of distinct directions with comparable subjects and framing. Present **actual image files**; verbal descriptions of styles are not a substitute. Follow the image tool's or environment's image skill instructions. A supplied, already chosen reference can satisfy this stage.

Choose by silhouette, proportion, composition, lighting, materials, and fitness for interaction. Save the chosen image, its available source or prompt, and the decisions. Do not invent missing generation metadata. Use the [direction record](assets/direction-template.md) when the project needs a persistent brief.

**Reference priority: the user's current intent → chosen image → derived sheets → implementation convenience.**

### Image generation with ChatGPT Images 2.5

Prefer the built-in `image_gen` tool for concepts, reference-led edits, construction views, and surface studies. OpenAI announced ChatGPT Images 2.5 for Codex on 2026-09-08; use the current integrated image workflow rather than assuming the older GPT-Image-2 CLI is required. Follow the installed imagegen skill for invocation, reference images, and file handling.

The integrated tool may not expose a model selector or return a backend model ID. Do not invent a `model` argument, infer the exact backend from image quality or the launch announcement, or promise Flare/Sunburst selection when the tool does not provide it. Record the tool, prompt, references, returned metadata, and actual output path; state when the backend version is not exposed.

When an explicitly selected API model is needed, preserve that request and verify the current official API identifier and account availability before calling it. **GPT-Image-2.5 Flare** is intended for faster iteration; **GPT-Image-2.5 Sunburst** is intended for detailed creative work and precise repeated edits. Prefer Sunburst for demanding production-reference refinement when explicitly selectable, and Flare for broad exploration. Do not silently downgrade to an earlier model or switch to a third-party paid generator. Use the authorized API/CLI workflow only if it actually supports the selected model; an unavailable selector is a limitation to disclose, not a parameter to fabricate.

Use chosen images as references for focused edits, preserving identity, proportions, framing, and already approved materials. Keep originals. Copy project-bound outputs into the project and verify dimensions, transparency, and suitability before applying them as maps. Improved generation does not replace reconstruction or validation in the destination renderer.

Source verified 2026-09-08: [OpenAI — Introducing ChatGPT Images 2.5](https://openai.com/index/introducing-chatgpt-images-2-5/). Recheck official guidance when exact model availability or API parameters matter.

## 2. Resolve construction questions

Read [prompts and references](references/prompts.md). Generate only the views, assembly details, surface studies, or textures that answer an actual production question. Use the chosen image as an editing reference when the tool supports it.

Check whether front, side, and top views could describe the same object. Generated views are hypotheses, not verified CAD drawings; reconcile conflicts against the main target. A lit concept sheet with paper, captions, and multiple objects is not automatically a usable material map.

Before applying maps, follow [production checks](references/production-checks.md). Measure actual dimensions and alpha; inspect cutouts, UVs, tiling, and scale. Use `scripts/inspect_image.py` for numerical inspection, not a visual-quality verdict. Preserve originals and derived versions.

## 3. Build in order of visual impact

Start with simple volumes and a camera: silhouette, proportions, screen coverage, depth, and room for the interface. Compare this blockout to the target before adding microdetail.

Choose geometry, instances, cutouts, or backgrounds according to silhouette, movement, occlusion, and interaction. Explorable parts must hold up from the intended angles; a flat image does not prove a three-dimensional reconstruction. Record hybrid approaches when used.

Resolve physical connections, ground contact, and separation between parts. Apply materials and lighting in the destination renderer early: an appearance approved in Blender still needs checking in the product. Use available tools without imposing one modeler or aesthetic.

## 4. Compare and iterate in the actual product

Read [comparison and performance](references/comparison-performance.md). Capture relevant views with comparable dimensions, camera, and state. Inspect the images as well as the logs.

Unless the user specifies another priority, address differences in this order:

1. Composition, camera, silhouette, and proportions.
2. Distribution of visual masses, depth, and contacts.
3. Lighting values, color, and material response.
4. Surface detail, effects, and motion.

Correct the largest mismatch, capture again, and record improvements and remaining differences. Do not redefine the target just to make the implementation look correct. Include close-ups, transitions, and interface states when they are part of the deliverable.

## 5. Verify performance and deliver evidence

For interactive scenes, measure on the stated device, effective resolution, and states. Record frame times, averages, percentiles, warm-up, and sample duration. **60 FPS is a target when requested; higher results are welcome while preserving delivery requirements.** Do not impose a 60 FPS cap without an explicit requirement. Disclose synchronization or measurement limits.

Optimize the measured bottleneck and compare visuals again after relevant changes. Do not hide reductions in resolution or quality. For offline images and video, use deliverable-appropriate metrics rather than an unnecessary interactive FPS test.

Deliver the target, relevant editable and exported files, comparable captures, actual measurements, and remaining differences. Do not promise pixel-perfect reproduction, validated maps, or FPS without evidence. If a tool is unavailable, complete independent work and identify the missing capability. Invoking this skill does not authorize publishing, purchasing services, or changing external configuration.
