# Publishing pages

Foam pages can be published.

TODO add publishing TOC

## Foam site generator?

Another case of the [[build-vs-assemble]] dilemma. We could provide a better publishing experience by building a bespoke static site generator (or a gatsby plugin) that's aware of Foam conventions (backlinks etc.)

Eventually we should probably do it, as that would unlock a huge amount of power, but we should always strive to keep it optional.

At a bare minimum, Foam repos should remain valid markdown, and should be publishable by any sufficiently complete markdown to html generation tools.

Would be cool if Foam pages could be published. Some ideas here.

- [x] Easymode: Make your GitHub public
- [x] Static site generator integration, publish from GH actions to GitHub pages / Netlify etc!!!
  - [ ] Add annotations to pages for setting visibility (many ways to do this)
    - [ ] Public by default, and `@private` annotations
    - [ ] Private by default, and `@public` annotations
    - [ ] Only public `/public` folder, just move a document there, no annotation needed
    - [ ] More granular access control? Email someone a link with a hash? [Testing](testing.md)
