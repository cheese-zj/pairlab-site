#!/usr/bin/env bash
# Encodes the short muted loops that play when a project card is hovered or
# focused (src/components/ProjectCard.tsx). Rerun after the reel or a source
# GIF changes:
#
#   scripts/encode-hover-clips.sh
#
# Sources are the lab's own approved footage only:
#   - the homepage reel, whose segments are labelled on screen by project
#     (times below are in public/media/pairlab-reel-1080.mp4);
#   - the hover GIFs the research cards used before, converted to MP4, which
#     plays the same frames at a fraction of the weight.
# CASF and StereoPatch have no footage of their own here yet, so their cards
# keep a still. Add a line below once real footage is approved.
set -euo pipefail

command -v ffmpeg >/dev/null || { echo 'Needs ffmpeg.' >&2; exit 1; }

root=$(cd "$(dirname "$0")/.." && pwd)
public="$root/public"
media="$public/media"
reel="$media/pairlab-reel-1080.mp4"

# No audio, two-second GOPs, index first. Small enough to start on hover.
encode() {
  local out=$1 width=$2
  shift 2
  ffmpeg -v error -y "$@" -an \
    -vf "scale=$width:-2:flags=lanczos,fps=24,format=yuv420p" \
    -c:v libx264 -preset veryslow -profile:v high -crf "${CRF:-30}" -g 48 -movflags +faststart \
    "$media/$out"
}

# From the reel (labelled SAKI 0-10 s, MAVP 11-18 s, NestDex 19-22 s).
encode hover-saki.mp4 960 -ss 0.6 -to 5.4 -i "$reel"
encode hover-mavp.mp4 960 -ss 11.4 -to 15.6 -i "$reel"
encode hover-nestdex.mp4 960 -ss 19.2 -to 22.8 -i "$reel"

# From the former hover GIFs, at their native width.
CRF=29 encode hover-patch.mp4 640 -i "$public/patch-towel-rollout.gif"
CRF=29 encode hover-trimanpolicy.mp4 640 -i "$public/triman-autonomous-hover.gif"
CRF=29 encode hover-autointervene.mp4 640 -i "$public/autointervene-bag-hover.gif"

ls -lh "$media"/hover-*.mp4
