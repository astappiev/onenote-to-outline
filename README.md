# Migrate from OneNote to Outline

Suddenly I needed to migrate from OneNote to Outline.
Unfortunately, there is no export to markdown in OneNote, and no easy way to import an archive of `.docx` files into Outline (at least it didn't work for me).

So I wrote this script to pull notes from OneNote and push them into Outline.
Quite stupid solution, but it worked for me.

## How to use

1. Copy `.env.example` to `.env` and fill in the values.
2. Install npm dependencies: `npm install`
3. Run the script: `npm run migrate`
