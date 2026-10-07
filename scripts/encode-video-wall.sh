#!/usr/bin/env bash
# Encodes the media for the /videos wall (src/videos.ts). Rerun after a
# source or a window below changes:
#
#   scripts/encode-video-wall.sh [real.mov sim-ego.mov sim-third.mov]
#
# Every wall entry has a loop and a poster in public/media/wall/:
#   <id>-loop.mp4   a short muted loop for the tile, cropped to the tile's
#                   shape and sped up where noted, so it never weighs much
#   <id>.webp       the loop's first frame, shown until the loop plays
# and a full clip for the expanded view: <id>.mp4 beside them, or, for
# footage a project site already publishes, that site's own file (its URL
# is the clip's src in src/videos.ts and the loop is cut from it here).
#
# Sources are the lab's own approved footage only:
#   - demo videos the research pages used to show (public/media/wall/<id>.mp4,
#     already H.264 with the index first);
#   - the homepage reel, whose segments are labelled on screen by project
#     (times below are in public/media/pairlab-reel-wide.mp4);
#   - footage published on the projects' own sites, and GIFs the cards used;
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
loop nestdex-wujihand "$wall/nestdex-wujihand.mp4" 2 12 1.5 1 0.6
loop triman-autonomous "$wall/triman-autonomous.mp4" 8 16 2 0.8 0.45
loop triman-collection "$wall/triman-collection.mp4" 60 16 2 1

# The homepage reel's labelled segments (SAKI 0-11 s, MAVP 11-23 s,
# NestDex 23-33 s), skipping each section's title card.
cut saki-reel "$reel" 0.6 10.6
loop saki-reel "$wall/saki-reel.mp4" 0 10 1 0.8 0.45
cut mavp-reel "$reel" 11.4 22.6
loop mavp-reel "$wall/mavp-reel.mp4" 0 11.2 1 0.75 0.5
cut nestdex-reel "$reel" 23.2 32.8
loop nestdex-reel "$wall/nestdex-reel.mp4" 0 9.6 1 1.778

# PATCH's towel rollout, from the GIF its card used before.
cut patch-towel "$public/patch-towel-rollout.gif" 0 14
loop patch-towel "$wall/patch-towel.mp4" 0 14 1.5 0.8 0.5

# Footage the project sites publish. Only the loop and poster live here: the
# expanded view streams the full clip from the site (src in src/videos.ts).
# remote <id> <url> <start> <seconds> <aspect> [focus-x], at the site's speed.
remote() {
  loop "$1" "$2" "$3" "$4" 1 "$5" "${6:-0.5}"
}
# CoRE's box assembly, published at 2x; the loop runs it 1.5x faster again.
loop core-box 'https://yananzhou.me/core/assets/media/box.mp4' 0 14.5 1.5 1
remote triman-towelhang 'https://cheese-zj.github.io/trimanpolicy-site/videos/towelhang/primary.mp4' 12.2 9.0 1.6
remote triman-totecards 'https://cheese-zj.github.io/trimanpolicy-site/videos/totecards/primary.mp4' 8.4 9.0 0.8
remote triman-bagtape 'https://cheese-zj.github.io/trimanpolicy-site/videos/bagtape/primary.mp4' 5.3 9.0 1
remote triman-lideraser 'https://cheese-zj.github.io/trimanpolicy-site/videos/lideraser/primary.mp4' 7.1 9.0 0.75
remote triman-traywipe 'https://cheese-zj.github.io/trimanpolicy-site/videos/traywipe/primary.mp4' 5.8 9.0 1.25
remote triman-bintowel 'https://cheese-zj.github.io/trimanpolicy-site/videos/bintowel/primary.mp4' 12.1 9.0 0.8
remote saki-tidy 'https://cheese-zj.github.io/saki-site/assets/clips/tidy.mp4' 4.2 9.0 1.25
remote saki-pour 'https://cheese-zj.github.io/saki-site/assets/clips/pour.mp4' 1.9 9.0 0.8
remote saki-collect 'https://cheese-zj.github.io/saki-site/assets/clips/collect.mp4' 2.6 9.0 1
remote saki-wipe 'https://cheese-zj.github.io/saki-site/assets/clips/wipe.mp4' 3.2 9.0 0.75
remote saki-door 'https://cheese-zj.github.io/saki-site/assets/clips/door.mp4' 0 9.0 0.8
remote saki-box 'https://cheese-zj.github.io/saki-site/assets/clips/box.mp4' 2.5 9.0 1.25
remote saki-grid 'https://cheese-zj.github.io/saki-site/assets/clips/grid.mp4' 0 4.8 1
remote nestdex-tongs 'https://cheese-zj.github.io/nestdex-site/videos/tongs/01.mp4' 6.7 9.0 0.8
remote nestdex-bottle 'https://cheese-zj.github.io/nestdex-site/videos/bottle/01.mp4' 4.0 9.0 0.75
remote nestdex-dual-object 'https://cheese-zj.github.io/nestdex-site/videos/dual-object/01.mp4' 4.3 9.0 1
remote nestdex-toast 'https://cheese-zj.github.io/nestdex-site/videos/toast/01.mp4' 52.9 9.0 1.25
remote nestdex-binder 'https://cheese-zj.github.io/nestdex-site/videos/binder/01.mp4' 22.6 9.0 0.8
remote stereopatch-bowl 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/bowl-1080p60.mp4' 10.4 9.0 1.25
remote stereopatch-placement 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/placement-1080p60.mp4' 9.5 9.0 0.8
remote stereopatch-picking 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/picking-1080p60.mp4' 8.8 9.0 1
remote stereopatch-peg 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/peg-1080p60.mp4' 2.7 9.0 0.75
remote stereopatch-picnic 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/picnic-1080p60.mp4' 10.9 9.0 1
remote stereopatch-cup 'https://github.com/YananZHOU5555/stereopatch/releases/download/media-v1/cup-1080p60.mp4' 3.3 9.0 0.8
remote core-pan 'https://yananzhou.me/core/assets/media/pan.mp4' 0 9.0 0.8
remote core-bridge 'https://yananzhou.me/core/assets/media/bridge.mp4' 2.5 9.0 1.25
remote core-stack 'https://yananzhou.me/core/assets/media/stack.mp4' 3.4 9.0 0.75
remote core-exchange 'https://yananzhou.me/core/assets/media/exchange.mp4' 2.9 9.0 1
remote core-box-perturbed 'https://yananzhou.me/core/assets/media/box_success_perturbed.mp4' 0 8.8 0.8
remote ai-towel-bag 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/towel-bagging.mp4' 8.3 9.0 1.25
remote ai-peg 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/peg-disassembly.mp4' 6.5 9.0 0.8
remote ai-potato 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/potato-transfer.mp4' 3.2 9.0 1
remote ai-towel-fold 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/towel-folding.mp4' 3.8 9.0 0.75
remote ai-lidded 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/lidded-box-packing.mp4' 5.1 9.0 1
remote ai-plant 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/plant-sorting.mp4' 2.5 9.0 0.8
remote ai-towel-box 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/towel-box-packing.mp4' 7.0 9.0 1.25
remote ai-two-towel 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/two-towel-box-packing.mp4' 13.7 9.0 0.8
remote ai-cable 'https://123qwedsa123.github.io/AutoIntervene/assets/videos/towels-and-cable-bagging.mp4' 15.6 9.0 1
remote mavp-drawer 'https://123qwedsa123.github.io/mavp/assets/videos/01-drawer-packing.mp4' 4.6 9.0 1.25
remote mavp-deliver 'https://123qwedsa123.github.io/mavp/assets/videos/02-disassemble-and-deliver.mp4' 4.0 9.0 0.8
remote mavp-lidded 'https://123qwedsa123.github.io/mavp/assets/videos/03-lidded-box-packing.mp4' 4.3 9.0 1
remote mavp-conveyor 'https://123qwedsa123.github.io/mavp/assets/videos/04-conveyor-picking.mp4' 3.3 9.0 0.8
remote mavp-dual-drawer 'https://123qwedsa123.github.io/mavp/assets/videos/05-dual-drawer-return.mp4' 5.0 9.0 1
remote mavp-bag 'https://123qwedsa123.github.io/mavp/assets/videos/06-bag-packing.mp4' 4.5 9.0 1.25
remote patch-clean 'https://yananzhou.me/PATCH/media/offline-cases/left-c1-clean-h264.mp4' 0 9.0 1
remote patch-static 'https://yananzhou.me/PATCH/media/offline-cases/left-c2-static-change-h264.mp4' 0 9.0 0.8
remote patch-transient 'https://yananzhou.me/PATCH/media/offline-cases/left-c3-transient-obstruction-h264.mp4' 0 9.0 1
remote patch-persistent 'https://yananzhou.me/PATCH/media/offline-cases/left-c4-persistent-obstruction-h264.mp4' 0 8.8 0.8
remote core-sim-threestack 'https://yananzhou.me/core/assets/media/RoboFactory_ThreeStack.mp4' 0 7.4 1
remote core-sim-takephoto 'https://yananzhou.me/core/assets/media/RoboFactory_TakePhoto.mp4' 0 4.7 0.8
remote core-sim-carry 'https://yananzhou.me/core/assets/media/DuoBench_Carry.mp4' 0 7.1 1.25
remote core-sim-ballmaze 'https://yananzhou.me/core/assets/media/DuoBench_BallMaze.mp4' 0 7.9 1

# Real to sim: three recordings of one run, kept as separate clips so the
# expanded view can play them together or one at a time. They share a start
# and a length, so the wall tile and the expanded view keep them in step.
# Nothing is upscaled: the real camera stays at its native 640x480.
if [[ $# -eq 3 ]]; then
  real=$1 sim_ego=$2 sim_third=$3
  # still <id> <full>: the poster, from one second in.
  still() {
    ffmpeg -v error -y -ss 1 -i "$wall/$1-loop.mp4" -frames:v 1 "$scratch/$1.png"
    cwebp -quiet -q 74 "$scratch/$1.png" -o "$wall/$1.webp"
  }
  # sync <id> <source> <full-height> <loop-height>
  sync() {
    local id=$1 src=$2 full=$3 small=$4
    ffmpeg -v error -y -i "$src" -an -vf "scale=-2:$full:flags=lanczos,fps=30,format=yuv420p" \
      "${h264[@]}" -preset slow -crf 22 -g 60 "$wall/$id.mp4"
    ffmpeg -v error -y -i "$src" -an -vf "scale=-2:$small:flags=lanczos,fps=24,format=yuv420p" \
      "${h264[@]}" -preset veryslow -crf 29 -g 48 "$wall/$id-loop.mp4"
    still "$id"
  }
  sync real-to-sim-real "$real" 480 480
  sync real-to-sim-sim "$sim_ego" 1080 540
  sync real-to-sim-third "$sim_third" 1080 540
  rm -f "$wall/real-to-sim.mp4" "$wall/real-to-sim-loop.mp4" "$wall/real-to-sim.webp"
fi

ls -lh "$wall"
