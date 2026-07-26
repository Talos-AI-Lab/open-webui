#!/usr/bin/env bash
# Build a .deb package for Open WebUI: a self-contained venv (built from the
# project's own wheel) plus a systemd service, packaged with fpm.
#
# Requirements: uv (https://astral.sh/uv), fpm (`gem install fpm`), python3-venv.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PKG_DIR="$REPO_ROOT/packaging/deb"
BUILD_DIR="$PKG_DIR/build"
PKGROOT="$BUILD_DIR/pkgroot"

VERSION="${VERSION:-$(node -pe "require('$REPO_ROOT/package.json').version")}"
ARCH="${ARCH:-amd64}"

command -v uv >/dev/null || { echo "uv is required: https://astral.sh/uv"; exit 1; }
command -v fpm >/dev/null || { echo "fpm is required: gem install fpm"; exit 1; }

echo ">>> Building Open Webui .deb v$VERSION ($ARCH)"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/wheelhouse" "$PKGROOT/opt/open-webui" "$PKGROOT/etc/open-webui" "$PKGROOT/var/lib/open-webui"

echo ">>> Building wheel (npm install + frontend build via hatch hook)"
( cd "$REPO_ROOT" && uv build --wheel -o "$BUILD_DIR/wheelhouse" )

WHEEL=$(ls "$BUILD_DIR"/wheelhouse/*.whl | head -1)
echo ">>> Using wheel: $WHEEL"

echo ">>> Installing wheel into packaged venv"
uv venv "$PKGROOT/opt/open-webui/venv" --python 3.12
VIRTUAL_ENV="$PKGROOT/opt/open-webui/venv" uv pip install --python "$PKGROOT/opt/open-webui/venv/bin/python" "$WHEEL"

cp "$PKG_DIR/open-webui.env" "$PKGROOT/etc/open-webui/open-webui.env"

chmod +x "$PKG_DIR/postinst.sh" "$PKG_DIR/prerm.sh"

echo ">>> Running fpm"
fpm -s dir -t deb \
  -n open-webui \
  -v "$VERSION" \
  -a "$ARCH" \
  --license "Other/Proprietary" \
  --maintainer "Open WebUI" \
  --url "https://openwebui.com" \
  --description "Open WebUI - self-hosted AI interface" \
  --after-install "$PKG_DIR/postinst.sh" \
  --before-remove "$PKG_DIR/prerm.sh" \
  --deb-systemd "$PKG_DIR/systemd/open-webui.service" \
  --depends "python3 (>= 3.11)" \
  --depends "systemd" \
  --deb-recommends "ffmpeg" \
  --config-files /etc/open-webui/open-webui.env \
  -p "$BUILD_DIR/open-webui_${VERSION}_${ARCH}.deb" \
  -C "$PKGROOT" \
  opt etc var

echo ">>> Built $BUILD_DIR/open-webui_${VERSION}_${ARCH}.deb"
