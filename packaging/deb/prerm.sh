#!/bin/sh
set -e

if [ "$1" = "remove" ] || [ "$1" = "purge" ]; then
    systemctl stop open-webui || true
    systemctl disable open-webui || true
fi

exit 0
