# Priest photos

Drop each priest's photo here (square images work best, e.g. 400×400 .jpg/.png/.webp),
then reference the filename from `src/data/priests.json` via the `photo` field, e.g.:

```
"photo": "/priests/fr-john.jpg"
```

To add a priest: add an entry to `src/data/priests.json` (name / role / brief / full,
each with `en` + `ta`) and drop the matching photo in this folder. To remove one,
delete its entry. `placeholder.svg` is the fallback avatar used by the example entry.
