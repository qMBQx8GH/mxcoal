#!/bin/bash
BASEDIR=$(dirname $0)
cd "${BASEDIR}"

/usr/bin/google-chrome-stable --pack-extension=src/mxCoal --pack-extension-key=$1
mv src/mxCoal.crx dist
