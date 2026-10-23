# Sigilizer

An Obsidian plugin that turns intentions into sigils inscribed in a magic circle, with PNG export.

![A sigil drawn in a note, with the Save PNG button below it](https://raw.githubusercontent.com/adamesch/obsidian-sigilizer/main/docs/screenshot.png)

## Usage

Write your intention in a `sigil` code block:

````markdown
```sigil
i am productive
```
````

The intention is reduced to a sigil string: letters only, no vowels (`y` counts as a consonant), and no repeated letters, so `i am productive` becomes `mprdctv`. The string is then drawn inside a ring of the 21 consonants. A small circle marks the first letter and an ✕ marks the last.

Click into the block to see and edit the original intention. Move the cursor away to see the sigil.

**Save PNG** writes `Sigils/sigil-mprdctv.png` to your vault and copies `![[sigil-mprdctv.png]]` to the clipboard.

## Settings

Output folder, PNG size, line and background colors, transparent background, stroke width, double ring, rotated letters, and whether to show the sigil string under the circle.

## Development

```sh
npm install
npm test        # unit tests for reduction + geometry
npm run build   # produces main.js
npm run dev     # rebuild on change
```

To try it, copy or symlink `main.js`, `manifest.json` and `styles.css` into `<vault>/.obsidian/plugins/sigilizer/`, then enable **Sigilizer** under Community plugins.
