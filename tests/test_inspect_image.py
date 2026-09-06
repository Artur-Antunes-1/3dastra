import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from PIL import Image

SCRIPT = Path(__file__).resolve().parents[1] / 'skills' / '3dastra' / 'scripts' / 'inspect_image.py'


class ImageAuditTests(unittest.TestCase):
    def audit(self, image, *arguments):
        self.assertTrue(SCRIPT.exists(), 'Image audit implementation is not present yet')
        result = subprocess.run([sys.executable, '-B', str(SCRIPT), str(image), *arguments], capture_output=True, text=True, encoding='utf-8')
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_opaque_rgb_is_not_a_cutout_and_input_is_unchanged(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'checkerboard.png'
            source = Image.new('RGB', (4, 3))
            source.putdata([(40, 40, 40) if (x+y) % 2 else (210, 210, 210) for y in range(3) for x in range(4)])
            source.save(image)
            before = hashlib.sha256(image.read_bytes()).hexdigest()
            report = self.audit(image)
            self.assertEqual(report['size'], {'width': 4, 'height': 3})
            self.assertFalse(report['alpha']['present'])
            self.assertEqual(report['alpha']['transparent_pixels'], 0)
            self.assertEqual(report['alpha']['opaque_pixels'], 12)
            self.assertEqual(report['sha256'], before)
            self.assertEqual(hashlib.sha256(image.read_bytes()).hexdigest(), before)

    def test_partial_alpha_and_exclusive_bounds(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'alpha.png'
            source = Image.new('RGBA', (2, 2))
            source.putdata([(0, 0, 0, 0), (50, 60, 70, 255), (80, 90, 100, 127), (120, 130, 140, 200)])
            source.save(image)
            report = self.audit(image)
            self.assertTrue(report['alpha']['present'])
            self.assertEqual(report['alpha']['transparent_pixels'], 1)
            self.assertEqual(report['alpha']['opaque_pixels'], 1)
            self.assertEqual(report['alpha']['partial_pixels'], 2)
            self.assertEqual(report['alpha']['threshold_bbox'], [1, 0, 2, 2])
            self.assertEqual(report['alpha']['threshold_uv_top_left'], [.5, 0, 1, 1])
            lower = self.audit(image, '--alpha-threshold', '127')
            self.assertEqual(lower['alpha']['threshold_bbox'], [0, 0, 2, 2])

    def test_palette_transparency_is_detected(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'palette.png'
            source = Image.new('P', (2, 2))
            source.putpalette([0, 0, 0, 40, 120, 40] + [0, 0, 0] * 254)
            source.putdata([0, 1, 0, 1])
            source.save(image, transparency=0)
            report = self.audit(image)
            self.assertTrue(report['alpha']['present'])
            self.assertEqual(report['alpha']['transparent_pixels'], 2)

    def test_edge_difference_is_numeric_not_a_quality_verdict(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'gradient.png'
            source = Image.new('RGB', (4, 3))
            source.putdata([(x*10, x*20, x*30) for y in range(3) for x in range(4)])
            source.save(image)
            report = self.audit(image)
            self.assertEqual(report['edges']['left_right_rgb_mae'], 60)
            self.assertEqual(report['edges']['top_bottom_rgb_mae'], 0)
            self.assertIsNone(report['visual_quality_verdict'])

    def test_json_output_and_source_overwrite_protection(self):
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory) / 'source.png'
            output = Path(directory) / 'audit.json'
            Image.new('RGB', (2, 2), 'gray').save(image)
            report = self.audit(image, '--output', str(output))
            self.assertEqual(json.loads(output.read_text(encoding='utf-8')), report)
            before = image.read_bytes()
            result = subprocess.run([sys.executable, '-B', str(SCRIPT), str(image), '--output', str(image)], capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(image.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
