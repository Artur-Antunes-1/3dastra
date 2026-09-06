"""Validate skill metadata, local reference links, and packaged file integrity."""
from hashlib import sha256
import json
from pathlib import Path
import re
from zipfile import ZipFile
import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills' / '3dastra'
text = (SKILL / 'SKILL.md').read_text(encoding='utf-8')
front = yaml.safe_load(text.split('---', 2)[1])
assert front['name'] == '3dastra'
assert front['license'] == 'MIT'
assert front['description'] and '[TODO' not in text
interface = yaml.safe_load((SKILL / 'agents/openai.yaml').read_text(encoding='utf-8'))['interface']
assert interface['display_name'] == '3DASTRA'
assert 25 <= len(interface['short_description']) <= 64
assert '$3dastra' in interface['default_prompt']
links = 0
for file in SKILL.rglob('*.md'):
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', file.read_text(encoding='utf-8')):
        if '://' not in target and not target.startswith('#'):
            resolved = (file.parent / target.split('#')[0]).resolve()
            assert resolved.is_relative_to(SKILL.resolve()), target
            assert resolved.is_file(), target
            links += 1
manifest = json.loads((ROOT / 'docs/package-manifest.json').read_text(encoding='utf-8'))
zip_path = ROOT / 'site/public/downloads/3DASTRA.zip'
assert sha256(zip_path.read_bytes()).hexdigest() == manifest['zip_sha256']
with ZipFile(zip_path) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == {'3dastra/' + name for name in manifest['files']}
    for name, digest in manifest['files'].items():
        assert sha256((SKILL / name).read_bytes()).hexdigest() == digest, name
        assert sha256(archive.read('3dastra/' + name)).hexdigest() == digest, name
print(f'Valid English skill metadata; {links} internal references; {len(manifest["files"])} matching packaged files.')
