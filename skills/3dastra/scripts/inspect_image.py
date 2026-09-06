#!/usr/bin/env python3
"""Read-only dimensions, alpha, edge and fingerprint audit for one raster image."""

import argparse
import hashlib
import json
from pathlib import Path
import sys

try:
    from PIL import Image, ImageChops, ImageStat
except ImportError:
    raise SystemExit("Pillow is required. Run this script in a Python environment with Pillow installed.")


def parse_threshold(value):
    try:
        threshold = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("alpha threshold must be an integer from 1 to 255") from error
    if not 1 <= threshold <= 255:
        raise argparse.ArgumentTypeError("alpha threshold must be from 1 to 255")
    return threshold


def edge_mae(first, second):
    means = ImageStat.Stat(ImageChops.difference(first, second)).mean
    return round(sum(means) / len(means), 6)


def inspect_image(source, threshold):
    with Image.open(source) as original:
        if getattr(original, "n_frames", 1) != 1:
            raise ValueError("Multi-frame images are not supported; provide one frame as a separate file.")
        original.load()
        width, height = original.size
        source_mode = original.mode
        source_format = original.format
        alpha_present = "A" in original.getbands() or "transparency" in original.info
        rgba = original.convert("RGBA")

    alpha = rgba.getchannel("A")
    histogram = alpha.histogram()
    bbox = alpha.point(lambda value: 255 if value >= threshold else 0).getbbox()
    rgb = rgba.convert("RGB")
    uv = [bbox[0] / width, bbox[1] / height, bbox[2] / width, bbox[3] / height] if bbox else None

    return {
        "schema_version": 1,
        "image": str(source),
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "format": source_format,
        "mode": source_mode,
        "size": {"width": width, "height": height},
        "alpha": {
            "present": alpha_present,
            "transparent_pixels": histogram[0],
            "opaque_pixels": histogram[255],
            "partial_pixels": sum(histogram[1:255]),
            "threshold": threshold,
            "threshold_bbox": list(bbox) if bbox else None,
            "threshold_uv_top_left": uv,
        },
        "edges": {
            "left_right_rgb_mae": edge_mae(rgb.crop((0, 0, 1, height)), rgb.crop((width - 1, 0, width, height))),
            "top_bottom_rgb_mae": edge_mae(rgb.crop((0, 0, width, 1)), rgb.crop((0, height - 1, width, height))),
        },
        "visual_quality_verdict": None,
        "notes": [
            "Bounds use a top-left origin with exclusive right and bottom edges.",
            "Alpha counts and edge differences use an 8-bit conversion.",
            "Edge RGB differences ignore alpha and do not prove visual tileability.",
            "Inspect the image and material in the target renderer before accepting visual quality.",
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path, help="Raster image to inspect; never modified")
    parser.add_argument("--alpha-threshold", type=parse_threshold, default=128, help="Inclusive alpha cutoff for bounds (1-255; default 128)")
    parser.add_argument("--output", type=Path, help="Optional JSON report; an existing report is replaced")
    args = parser.parse_args()

    try:
        source = args.image.resolve(strict=True)
        output = args.output.resolve() if args.output else None
        if output is not None:
            if output == source or (output.exists() and output.samefile(source)):
                raise ValueError("Report output must not overwrite the input image.")
            if output.suffix.lower() != ".json":
                raise ValueError("Report output must have a .json extension.")
        report = inspect_image(source, args.alpha_threshold)
        serialized = json.dumps(report, indent=2, ensure_ascii=True) + "\n"
        if output is not None:
            output.write_text(serialized, encoding="utf-8")
        sys.stdout.write(serialized)
    except (OSError, ValueError, Image.DecompressionBombError) as error:
        parser.exit(2, f"Image audit failed: {error}\n")


if __name__ == "__main__":
    main()
