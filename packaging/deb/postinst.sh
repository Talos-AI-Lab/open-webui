#!/bin/sh
set -e

if ! getent group open-webui >/dev/null; then
    addgroup --system open-webui
fi

if ! getent passwd open-webui >/dev/null; then
    adduser --system --ingroup open-webui --home /var/lib/open-webui --no-create-home \
        --shell /usr/sbin/nologin open-webui
fi

mkdir -p /var/lib/open-webui
chown -R open-webui:open-webui /var/lib/open-webui
chown -R open-webui:open-webui /opt/open-webui

systemctl daemon-reload || true

echo "Open WebUI installed."
echo "Edit /etc/open-webui/open-webui.env (set OLLAMA_BASE_URL if using Ollama) then run:"
echo "  systemctl enable --now open-webui"

exit 0
