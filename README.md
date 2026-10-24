# Tokyo Trips · December 2–12, 2026

Personal GitHub Pages itinerary: https://jacfger.github.io/tokyo-trips/

## October 25 revision

- December 6: Yokohama. The former Kichijoji / Inokashira / Koenji day is retained as a replacement option.
- December 7: the quieter eastern-Tokyo day remains between the day trips.
- December 8: Kamakura, with a full coastal route or a shorter temples / soba version.
- December 9: flexible Asakusa half-day; Meiji cafeteria / Jimbocho and a completely free day remain alternatives.
- December 10: Kashiwa-no-ha and its existing optional return stops remain.
- December 11: Harajuku pizza / Samoyeds; the original Zuicho / Shibuya food route is preserved as an alternative lunch plan.

Use the Optional trips tab, the Route preview selector, and optional-stop controls. Compare overlays the selected route in green and the revised reference in purple. Matching route blocks are drawn once. Choices persist in browser localStorage; Copy comparison link includes route settings, not shopping notes. No bookings are made.

## Files / maintenance

`planner-v8.html` is an immutable copy of the previously published single-file planner (Git blob e6e1318eec848b0495b1c1b67edd53973ceced51). It is both the base engine / data source and a fallback page. Do not delete it.

`index.html` loads that same-origin source, imports its UI and styles, executes its engine without the initial render, and applies `trip-update.js`. `trip-update.css` adds responsive comparison controls while retaining the original design. No build step or third-party JavaScript framework is required. Serve over HTTP(S), not file://, because the loader fetches local source files.

Future changes belong in the extension. Preserve existing shopping / cafe localStorage keys. New route preferences use `tokyoTripOptionsV9`. Update cache query strings when changing assets.

## Map accuracy

OpenStreetMap tiles and FOSSGIS routed-foot walking geometry are external requests. A successful walking route produces a solid line; otherwise dotted lines show stop order only. Dashed rail / bus lines are schematic connections, not track / road alignment. The map never silently substitutes driving geometry. New pins are approximate planning points; named place / directions links should be used to find the actual entrance. Distances are shown only after all relevant walking blocks have routed successfully. Check live transport and current venue opening / booking rules before travel.

## Validation for this revision

The actual loader and source were exercised with Playwright/Chromium using local fetch fixtures, across the overview, all eleven dates, optional-trip library, food, cafe and shopping tabs; 22 optional / alternative states; selected-versus-reference visibility; serialized preference restoration; and desktop / 390px mobile layouts. No JavaScript page errors were reported. Tile and routing failures were deliberately tested. External browser navigation was unavailable in the editing environment, so this does not claim live walking-service or live-site browser verification. New Git object hashes were compared with the locally tested sources before publication.
