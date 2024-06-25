#!/usr/bin/env bash

export HUGOxPARAMSxGITxLAST_COMMITxSUBJECT=""
HUGOxPARAMSxGITxLAST_COMMITxSUBJECT=$(git log --follow --format="%as: %s," -- content/uses/index.md)
