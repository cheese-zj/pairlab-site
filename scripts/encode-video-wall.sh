#!/usr/bin/env bash
# Encodes the media for the /videos wall (src/videos.ts). Rerun after a
# source or a window below changes:
#
#   scripts/encode-video-wall.sh [real.mov sim-ego.mov sim-third.mov]
#
# Every wall entry has three files in public/media/wall/:
#   <id>.mp4        the full clip, opened in the expanded view (with sound
#                   where the source has it)
#   <id>-loop.mp4   a short muted loop for the tile, cropped to the tile's
#                   shape and sped up where noted, so it never weighs much
#   <id>.webp       the loop's first frame, shown until the loop plays
#
# Sources are the lab's own approved footage only:
#   - demo videos the research pages used to show, kept as the full clips
#     (public/media/wall/<id>.mp4, already H.264 with the index first);
#   - the homepage reel, whose segments are labelled on screen by project
#     (times below are in public/media/pairlab-reel-wide.mp4);
#   - footage published on a project's own site or GIFs the cards used;
#   - the real-to-sim recordings, passed as arguments because the raw
#     captures are too large to keep in public/. Without them the existing
#     real-to-sim files are left alone.
set -euo pipefail

command -v ffmpeg >/dev/null && command -v cwebp >/dev/null || { echo 'Needs ffmpeg and cwebp (brew install ffmpeg webp).' >&2; exit 1; }

root=$(cd "$(dirname "$0")/.." && pwd)
public="$root/public"
wall="$public/media/wall"
reel="$public/media/pairlab-reel-wide.mp4"
mkdir -p "$wall"
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT

h264=(-c:v libx264 -profile:v high -pix_fmt yuv420p -movflags +faststart)

# loop <id> <source> <start> <seconds> <speed> <aspect> [focus-x]
# Crops to the tile's aspect (width/height, e.g. 0.8 for 4:5) around a
# horizontal focus (0 left, 0.5 centre, 1 right), then scales to 540 px high.
loop() {
  local id=$1 src=$2 start=$3 seconds=$4 speed=$5 aspect=$6 focus=${7:-0.5}
  local crop="crop=w='min(iw,trunc(ih*$aspect/2)*2)':h=ih:x='(iw-ow)*$focus':y=0"
  ffmpeg -v error -y -ss "$start" -t "$seconds" -i "$src" -an \
    -vf "$crop,setpts=PTS/$speed,fps=24,scale=-2:540:flags=lanczos,format=yuv420p" \
    "${h264[@]}" -preset veryslow -crf 30 -g 48 "$wall/$id-loop.mp4"
  ffmpeg -v error -y -i "$wall/$id-loop.mp4" -frames:v 1 "$scratch/$id.png"
  cwebp -quiet -q 72 "$scratch/$id.png" -o "$wall/$id.webp"
}

# cut <id> <source> <start> <end>: a silent full clip from the reel or a GIF.
cut() {
  local id=$1 src=$2 start=$3 end=$4
  ffmpeg -v error -y -ss "$start" -to "$end" -i "$src" -an \
    -vf "fps=30,format=yuv420p" "${h264[@]}" -preset slow -crf 24 -g 60 "$wall/$id.mp4"
}

# Former research-page demos: the full clips are already in place.
loop autointervene-bag "$wall/autointervene-bag.mp4" 18 16 2 1
loop autointervene-disassembly "$wall/autointervene-disassembly.mp4" 8 16 2 0.8 0.4
loop autointervene-towel "$wall/autointervene-towel.mp4" 4 16 2 1.333
loop autointervene-vegetable "$wall/autointervene-vegetable.mp4" 2 12 1.5 0.75 0.4
loop nestdex-paper "$wall/nestdex-paper.mp4" 40 24 3 0.8 0.55
loop nestdex-wujihand "$wall/nestdex-wujihand.mp4" 2 12 1.5 1 0.6
loop nestdex-toaster "$wall/nestdex-toaster.mp4" 10 24 3 1.6
loop triman-autonomous "$wall/triman-autonomous.mp4" 8 16 2 0.8 0.45
loop triman-cloth "$wall/triman-cloth.mp4" 20 24 3 1.6
loop triman-collection "$wall/triman-collection.mp4" 60 16 2 1

# The homepage reel's labelled segments (SAKI 0-11 s, MAVP 11-23 s,
# NestDex 23-33 s), skipping each section's title card.
cut saki-reel "$reel" 0.6 10.6
loop saki-reel "$wall/saki-reel.mp4" 0 10 1 0.8 0.45
cut mavp-reel "$reel" 11.4 22.6
loop mavp-reel "$wall/mavp-reel.mp4" 0 11.2 1 0.75 0.5
cut nestdex-reel "$reel" 23.2 32.8
loop nestdex-reel "$wall/nestdex-reel.mp4" 0 9.6 1 1.778

# CoRE's box assembly from its project site, already shown there at 2x.
ffmpeg -v error -y -i 'https://yananzhou.me/core/assets/media/box.mp4' -map 0:v:0 -c copy -movflags +faststart "$wall/core-box.mp4"
loop core-box "$wall/core-box.mp4" 0 14.5 1.5 1
# PATCH's towel rollout, from the GIF its card used before.
cut patch-towel "$public/patch-towel-rollout.gif" 0 14
loop patch-towel "$wall/patch-towel.mp4" 0 14 1.5 0.8 0.5

# Real to sim: one composite so the three views can never drift apart. The
# third-person view fills the left; the robot's own camera sits on the right,
# real above sim. src/videos.ts places the labels from these proportions.
if [[ $# -eq 3 ]]; then
  real=$1 sim_ego=$2 sim_third=$3
  composite() {
    local out=$1 height=$2 crf=$3
    local half=$((height / 2)) side=$((height * 2 / 3))
    ffmpeg -v error -y -i "$sim_third" -i "$real" -i "$sim_ego" -an \
      -filter_complex "[0:v]scale=-2:$height:flags=lanczos[a];[1:v]scale=$side:$half:flags=lanczos[b];[2:v]scale=$side:$half:flags=lanczos[c];[b][c]vstack[r];[a][r]hstack,fps=30,format=yuv420p" \
      "${h264[@]}" -preset slow -crf "$crf" -g 60 "$out"
  }
  composite "$wall/real-to-sim.mp4" 1080 22
  composite "$wall/real-to-sim-loop.mp4" 540 28
  ffmpeg -v error -y -ss 1 -i "$wall/real-to-sim-loop.mp4" -frames:v 1 "$scratch/real-to-sim.png"
  cwebp -quiet -q 74 "$scratch/real-to-sim.png" -o "$wall/real-to-sim.webp"
fi

ls -lh "$wall"
