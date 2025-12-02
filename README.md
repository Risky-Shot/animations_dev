# 🔧 RedM Animation Explorer — DevTool

A developer-focused Animation Explorer for RedM, designed to help you quickly search, preview, and configure animations with ease. Perfect for scripters who need a fast way to browse animation dictionaries, test flags, tweak speeds, and copy-ready values for use in scripts.

<img width="976" height="449" alt="image" src="https://github.com/user-attachments/assets/d2a5f6dc-ece2-44ed-a84d-d746a8c8c6a6" />

## Features

### Smart Animation Search & Filtering

- Search any animation by name in real time.
- Type multiple terms to refine results.
- Prefix a term with ! to exclude animations containing that word.
- `Example: Searching walk !drink will show all animations that include “walk” but exclude any dictionary with “drink”.`

### Animation Playback Options

- Choose animation flags from a friendly selector.
- Configure:
  - Blend In Speed
  - Blend Out Speed
  - Playback Rate
  - Choose the entity on which the animation will play. `Default: PlayerPedId()` Optionally type entity ID.

### Copy-Ready Values

- A small, read-only text area displays:
  - Animation Dictionary
  - Animation Clip
  - Animation Flags
    
Quick-copy and paste directly into your RedM script.

## Installation

1. Download the latest release from the Releases section.
2. Unzip the downloaded file.
3. Make sure the folder is named correctly: ```animations_dev```
4. Place the folder into your server’s resources folder.
5. Ensure the resource to your server.cfg: `ensure animations_dev`

## Credits
Special thanks to [spAnser](https://github.com/spAnser) and Pioneer Village for foundational code and inspiration used in this project.
