#!/usr/bin/env bash
# Encodes the homepage film from a master export. Rerun whenever the cut changes:
#
#   scripts/encode-home-film.sh path/to/PAIRLab_60s.mp4 [loop-start] [loop-end]
#
# Writes to public/media/ (served through the Worker, which answers the byte-range
# requests Safari needs) and the two posters to public/:
#   media/pairlab-film.mp4          full cut with sound, opened from "Watch the film"
#   media/pairlab-reel-1080.mp4     muted ambient loop for the hero, desktop
#   media/pairlab-reel-720.mp4      the same loop for phones
#   pairlab-reel-poster.webp        first frame of the loop, shown before playback
#   pairlab-film-poster.webp        title frame of the full cut
#
# The loop skips the film's cream title and end cards, so the hero stays dark.
# Defaults match the v7 cut: footage runs from 6.0 s until the end card at 55.0 s.
set -euo pipefail

command -v ffmpeg >/dev/null && command -v cwebp >/dev/null || { echo 'Needs ffmpeg and cwebp (brew install ffmpeg webp).' >&2; exit 1; }

source_file=${1:?usage: scripts/encode-home-film.sh master.mp4 [loop-start] [loop-end]}
loop_start=${2:-6.0}
loop_end=${3:-55.0}
title_frame=2.5

root=$(cd "$(dirname "$0")/.." && pwd)
media="$root/public/media"
mkdir -p "$media"

# Two-second GOPs keep start-up and looping snappy; faststart puts the index first.
# The phone footage is grainy, so a light denoise spends the bitrate on the robots
# rather than sensor noise. Rate caps keep every file well under the 25 MiB limit.
h264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -g 60 -keyint_min 60 -sc_threshold 0 -movflags +faststart)
denoise=hqdn3d=1.5:1.5:6:6

ffmpeg -v error -y -ss "$loop_start" -to "$loop_end" -i "$source_file" -an \
  -vf "$denoise" "${h264[@]}" -crf 26 -maxrate 2M -bufsize 4M "$media/pairlab-reel-1080.mp4"

ffmpeg -v error -y -ss "$loop_start" -to "$loop_end" -i "$source_file" -an \
  -vf "$denoise,scale=1280:720:flags=lanczos" "${h264[@]}" -crf 27 -maxrate 1M -bufsize 2M "$media/pairlab-reel-720.mp4"

ffmpeg -v error -y -i "$source_file" \
  -vf "$denoise" "${h264[@]}" -crf 23 -maxrate 2600k -bufsize 5200k -c:a aac -b:a 128k "$media/pairlab-film.mp4"

# Posters go through cwebp (Homebrew's ffmpeg is built without libwebp).
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
frame="$scratch/poster.png"
poster() {
  ffmpeg -v error -y -ss "$1" -i "$source_file" -frames:v 1 -vf scale=1920:-2:flags=lanczos "$frame"
  cwebp -quiet -q 78 "$frame" -o "$2"
}
poster "$loop_start" "$root/public/pairlab-reel-poster.webp"
poster "$title_frame" "$root/public/pairlab-film-poster.webp"

ls -l "$media" "$root/public/pairlab-reel-poster.webp" "$root/public/pairlab-film-poster.webp"
