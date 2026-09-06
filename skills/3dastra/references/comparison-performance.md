# Visual comparison and performance

Read when validating the blockout, integration, and delivery. Evaluate appearance and cost at the same quality settings.

## Prepare comparable captures

Record the target, model revision, renderer, camera, lighting state, interface, viewport, pixel scale, and effective drawing-buffer dimensions. In web applications, distinguish canvas CSS dimensions from the number of pixels actually rendered. Do not infer effective resolution from the window size or a requested setting.

Capture views the user will see: overview, relevant close-up, transitions, and states that change content or lighting. Do not invent camera angles the product cannot use.

When target and viewport aspect ratios differ, define and record a consistent crop. Do not stretch or reframe every capture differently to hide mismatches. The camera must still work at the real screen size, including edges and interface space.

Compare side by side or switch between aligned images. Numerical pixel differences may help, but do not replace assessment of composition, materials, and spatial coherence. Vegetation and particles can vary between frames; repeat conditions when possible.

## Make an assessable correction

| Record | Generic example |
| --- | --- |
| Observed mismatch | The object nearly fills the frame vertically, leaving little room above. |
| Hypothesis | The camera is too close for the chosen composition. |
| Change | Adjust camera distance and target while preserving object proportions. |
| Evidence | A new capture at the same viewport, compared with the reference. |
| Result | Better screen coverage; the opening on the side is still too wide. |

Change one family of variables at a time when it helps explain the effect. Prioritize camera and silhouette before relief, glow, or particles. Describe remaining differences concretely. Stop when agreed criteria are met; do not run more rounds without a hypothesis or expected benefit.

## Measure an interactive scene

If profiling is unavailable, deliver captures and identify the missing measurement. Do not estimate FPS from appearance or a successful build.

- State the device, GPU when available, browser or runtime, scene revision, and quality settings.
- Record viewport, effective buffer, pixel scale, and any dynamic resolution.
- Warm up until loading and compilation settle. Then sample long enough to include the relevant interaction. Ten seconds of warm-up and sixty seconds of sampling are an example, not a universal rule.
- Separate initial loading, steady state, and close-ups or transitions with different costs.
- Record frame count, elapsed time, average FPS, and P95/P99 frame times. Calculate average FPS as frames divided by elapsed time, not the average of instantaneous rates.
- Identify the measurement source: callback intervals, CPU time, GPU time, or another source. Animation callbacks alone do not prove the number of distinct frames presented.

60 FPS corresponds to approximately **16.67 ms per frame**. High P95/P99 values reveal uneven pacing that a good average can hide. Set acceptance criteria for the product and hardware; do not promise the same frame rate on every device.

**60 can be a target, not an automatic cap.** Do not add an artificial limiter because the user mentioned 60 FPS. Display refresh or synchronization may limit observed rates; disclose that and use CPU/GPU timings where available to assess headroom. Do not claim a rate above 60 merely because the model became lightweight.

### Example of an accurate conclusion

A requested 1920 × 1080 window with a 1280 × 720 drawing buffer is effectively rendering at 720p. An average of 60 FPS, P95 of 24 ms, P99 of 45 ms, and eight seconds without warm-up do not establish stable 60 FPS at 1080p. Keep this as a preliminary sample and measure under the intended conditions.

## Optimize the observed bottleneck

Use profiling to choose among submission cost, geometry, fragments and overlapping transparency, shadows, materials, post-processing, memory, and loading. Shared resources, instances, and levels of detail are options, not universal solutions.

After changing resolution, density, materials, lighting, or geometry, capture the same views. Compare quality and performance together. A faster scene that breaks the chosen appearance is not a successful visual optimization.

For offline rendering, record output dimensions, rendering time, and characteristics relevant to the result. An exported video's frame rate does not measure interactive rendering capability.

## Deliver verifiable results

Tie evidence to the exact scene revision. Include targets, relevant production files, final captures, actual measurements, test conditions, and observed limits. Clearly distinguish:

- Appearance visually inspected.
- Loading and interactions exercised.
- Performance measured in the stated environment.
- Steps not yet executed.

Publish or change external resources only within existing authorization. A request for a skill or a concept image does not automatically authorize deployment.
