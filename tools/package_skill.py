"""Build the portable skill without bundling the website or showcase images."""
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills' / '3dastra'
FILES = ['SKILL.md', 'LICENSE', 'agents/openai.yaml', 'assets/direction-template.md',
         'references/prompts.md', 'references/production-checks.md',
         'references/comparison-performance.md', 'scripts/inspect_image.py']


def main():
    package = BytesIO()
    hashes = {}
    with ZipFile(package, 'w', compression=ZIP_DEFLATED) as archive:
        for name in sorted(FILES):
            content = (SKILL / name).read_bytes()
            hashes[name] = sha256(content).hexdigest()
            entry = ZipInfo('3dastra/' + name)
            entry.compress_type = ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content)
    destination = ROOT / 'site' / 'public' / 'downloads' / '3DASTRA.zip'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(package.getvalue())
    manifest = {'name': '3DASTRA', 'language': 'en', 'license': 'MIT',
                'files': hashes, 'zip_sha256': sha256(package.getvalue()).hexdigest()}
    (ROOT / 'docs' / 'package-manifest.json').write_bytes((json.dumps(manifest, indent=2) + '\n').encode('utf-8'))
    print(f'Packaged {len(FILES)} skill files ({destination.stat().st_size} bytes).')


if __name__ == '__main__':
    main()
