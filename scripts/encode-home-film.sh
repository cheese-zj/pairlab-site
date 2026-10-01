#!/usr/bin/env bash
# Encodes the homepage film from a master export. Rerun whenever the cut changes:
#
#   scripts/encode-home-film.sh path/to/master.mp4 [loop-start] [loop-end] [title-frame]
#
# Writes to public/media/ (served through the Worker, which answers the byte-range
# requests Safari needs) and the two posters to public/:
#   media/pairlab-film.mp4          full cut with sound, opened from "Watch the film"
#   media/pairlab-reel-wide.mp4     muted ambient loop for the hero, desktop
#   media/pairlab-reel-narrow.mp4   the same loop for phones, lighter
#   pairlab-reel-poster.webp        first frame of the loop, shown before playback
#   pairlab-film-poster.webp        title frame of the full cut
#
# The loop skips the film's title and cream end card, so the hero stays dark.
# Defaults match the October 2026 cut: the title holds until 3.5 s and the end
# card starts fading in after 62.5 s. Nothing is ever upscaled.
set -euo pipefail

command -v ffmpeg >/dev/null && command -v cwebp >/dev/null || { echo 'Needs ffmpeg and cwebp (brew install ffmpeg webp).' >&2; exit 1; }

source_file=${1:?usage: scripts/encode-home-film.sh master.mp4 [loop-start] [loop-end] [title-frame]}
loop_start=${2:-3.5}
loop_end=${3:-62.5}
title_frame=${4:-2.5}

root=$(cd "$(dirname "$0")/.." && pwd)
media="$root/public/media"
mkdir -p "$media"

# Two-second GOPs keep start-up and looping snappy; faststart puts the index first.
# The phone footage is grainy, so a light denoise spends the bitrate on the robots
# rather than sensor noise. Rate caps keep every file well under the 25 MiB limit.
h264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -g 60 -keyint_min 60 -sc_threshold 0 -movflags +faststart)
denoise=hqdn3d=1.5:1.5:6:6

ffmpeg -v error -y -ss "$loop_start" -to "$loop_end" -i "$source_file" -an \
  -vf "$denoise,scale=-2:'min(ih,1080)':flags=lanczos" "${h264[@]}" -crf 27 -maxrate 2M -bufsize 4M "$media/pairlab-reel-wide.mp4"

ffmpeg -v error -y -ss "$loop_start" -to "$loop_end" -i "$source_file" -an \
  -vf "$denoise,scale=-2:'min(ih,720)':flags=lanczos" "${h264[@]}" -crf 28 -maxrate 900k -bufsize 1800k "$media/pairlab-reel-narrow.mp4"

# A master that is already H.264 with AAC only needs its index moved to the
# front; re-encoding it would just lose quality.
codecs=$(ffprobe -v error -show_entries stream=codec_name -of csv=p=0 "$source_file" | sort -u | tr '\n' ' ')
if [[ $codecs == "aac h264 " ]]; then
  ffmpeg -v error -y -i "$source_file" -map 0:v:0 -map 0:a:0 -c copy -movflags +faststart "$media/pairlab-film.mp4"
else
  ffmpeg -v error -y -i "$source_file" \
    -vf "$denoise,scale=-2:'min(ih,1080)':flags=lanczos" "${h264[@]}" -crf 23 -maxrate 2600k -bufsize 5200k -c:a aac -b:a 128k "$media/pairlab-film.mp4"
fi

# Posters go through cwebp (Homebrew's ffmpeg is built without libwebp).
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
frame="$scratch/poster.png"
poster() {
  ffmpeg -v error -y -ss "$1" -i "$source_file" -frames:v 1 -vf "scale='min(iw,1920)':-2:flags=lanczos" "$frame"
  cwebp -quiet -q 78 "$frame" -o "$2"
}
poster "$loop_start" "$root/public/pairlab-reel-poster.webp"
poster "$title_frame" "$root/public/pairlab-film-poster.webp"

ls -l "$media" "$root/public/pairlab-reel-poster.webp" "$root/public/pairlab-film-poster.webp"
