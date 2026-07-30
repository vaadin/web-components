# Date Picker — Architecture

Notes on the parts of `<vaadin-date-picker>` whose design is not obvious from the code. Currently
covers date metadata resolution.

## Date metadata

`isDateDisabled` answers one date at a time and synchronously, which cannot be backed by a server. The
`dateMetadataProvider` is the asynchronous, batched counterpart: it is called for a **range** of dates
and may return a promise, so the answer can come from a backend.

`DateMetadataController` decides which ranges to request, caches answers, and notifies consumers.

> The controller is not wired into the component yet. Paragraphs marked _planned_ describe the
> integration it is built for, which lands separately.

### Where the cache lives

The cache is owned by the date-picker element rather than by the overlay content, because the overlay
content is created lazily on first open. Keeping the cache on the element means it survives opening and
closing the overlay.

The month calendars therefore read a controller they do not own, which is why change notification is
explicit rather than a property assignment (see _Notification_).

_Planned:_ validating a value that was set or typed without ever opening the overlay needs the metadata
too, which is only possible with the cache on the element. Validation does not consult the provider yet.

### One provider for all metadata

One function returns all of a date's metadata, rather than a generator per concern, so a single backend
query answers everything instead of making a pass per concern. Only the disabled state is read today;
further metadata extends the same entry shape.

### Ranges and blocks

`ensureRangeLoaded(start, end)` rounds the requested range out to whole blocks of `BLOCK_MONTHS` (12).
Months already loaded or in flight are skipped, and the months left over are loaded with a **single
call**, narrowed to the first and last of them.

Blocks are counted from January of year 0, so one block is exactly one calendar year. Rounding out to a
block rather than centring a buffer on the request is what makes navigating cheap: a buffer moves with
the request, so stepping forward one month leaves one new month missing at the far edge, and one missing
month is one more request — stepping through a year that way costs a request per month. Inside a block
there is nothing missing, so it costs nothing. Debouncing does not cover this on its own, since deliberate
month-at-a-time navigation is slower than any debounce window.

Fixed blocks also mean every caller asks for the same ranges, which a server can cache. Ranges centred on
wherever the user happens to be looking are all slightly different, so they cannot be.

A month is rounded **down** to its block, not towards zero, so that a date before year 0 lands in the
block it belongs to rather than the one after it.

Narrowing keeps the call to what is missing: when an answered block falls between two missing ones, the
range covers it rather than splitting into a call per gap — one round trip for a slightly wider range.

A call marks as pending, and later writes, only the months it is loading — never the ones its range
merely covers. An answered month keeps its metadata while the wider reply is in flight, so a date known
to be disabled cannot go back to being selectable partway through a scroll.

A month is either fully resolved or not resolved at all, and only being loaded resolves it. Metadata the
provider volunteers for any other month is dropped, including for a month the range covered, so a
month's own answer is the only thing that can decide its dates.

Each call that finds a missing month issues its own request; the controller does not coalesce calls. A
caller that loads on scroll debounces instead.

### One record per month

Whether a month is still pending and what it holds are kept in the same record, so the two cannot
disagree, and `isLoading()` is derived by looking for a pending month rather than counted separately.

A month has no record until it is loaded, so it is pending, resolved, or absent. That makes what is
absent exactly what needs loading, and it is why a failure removes the months it covered rather than
marking them.

Every pending month shares one frozen record, because a month being fetched has nothing of its own to
hold: only a resolved month is ever read for entries. Anything that has to be remembered per month while
it is in flight would need a record per month again.

Resolving a month writes a fresh record, so its entries replace the previous ones rather than merging
into them: a month's own answer is complete by definition. A resolved month is currently only
re-requested after `clearCache()`, which drops it first, so replace and merge are not distinguishable
through the API — replacing is what keeps that true if a per-month refresh is added.

### Only known-disabled dates are disabled

The controller's `isDateDisabled` is true when the date's month is resolved **and** its metadata says so. A
date whose month is still being fetched is not disabled, and is re-checked when the month resolves.

Being optimistic and correcting afterwards keeps rendering, selection and validation consistent with
each other, since they all read the same predicate. Treating an unresolved date as unusable would
instead make the whole visible calendar go dead while a slow provider answers, and report a value
invalid on every fresh load before anything is known about it.

_Planned:_ dates in a month that is still loading render with a `pending` part while a loading indicator
is shown, but they stay selectable.

### Notification

**Subscribers are invalidated synchronously** with `requestUpdate()`. A subscriber must render from its
bindings: `requestUpdate()` leaves the changed properties empty, so `PolylitMixin` does not re-run
observers, and state applied imperatively from an observer is refreshed from the host callback instead. A
subscriber must also not be the element whose own observer triggered the load, or it invalidates itself
mid-update.

There is no `unsubscribe`: a subscriber is retained for the controller's lifetime. _Planned:_ the month
scroller creates its pool of calendars once and afterwards only reassigns which month each one shows, so
every subscriber lives as long as the controller's host.

**The host callback is deferred by one microtask and coalesced.** Loads are triggered from observers
that run inside a Lit update, and the host reacts by writing reactive state of its own. Writing reactive
state during an update logs Lit's `change-in-update` warning and makes `updateComplete` resolve to
`false`, a source of one-tick-late test failures. Coalescing then means that starting several requests in
one task, or several of them resolving in one task, costs one callback rather than one per month range.

The provider's answer is awaited whether it is a promise or a plain array, so a request always resolves in
a later task than it started in, and a provider's failure is contained in one place.

### Request lifetime

Requests carry a generation counter that only `clearCache()` advances. An answer from a superseded generation
is discarded; one from the current generation is applied even if the host was detached meanwhile, since
discarding it would only re-fetch the same range.

There is therefore no disconnect handling. `hostConnected()` re-notifies instead, because notifications
are skipped while the host is disconnected and state that resolved in the meantime would never reach it.

### Failures fail open

A provider that throws or rejects is treated as no metadata for those months: the error is logged, the
months are dropped from the cache, and nothing is disabled. Dropping them is what stops them from
rendering as perpetually pending, and the error must not escape the scroll or render path that triggered
the load. Applying a result is kept outside that error handling, so an exception from a subscriber is not
reported as a provider failure.

A result that is not an array, and an entry that does not describe a real date, are reported rather than
ignored, since ignoring them would present a provider bug as "nothing is disabled". Entries are checked by
rebuilding the date and comparing it back, which catches a month outside 0–11, a day outside its month and
February 30 alike — each would otherwise be stored under a key that no lookup can produce. A month given
1-based cannot be caught this way, since it is a valid month number, so the 0-based contract is stated on
the provider type instead.

The three fields are type-checked before that, which is not redundant: a value that cannot be coerced to a
number, a bigint say, throws while the date is being rebuilt. Since the answer is applied inside the
error handling above, one such entry would otherwise discard the whole range and have it requested again
on every navigation, instead of costing only itself.

Both of those are mistakes in how the provider is written rather than runtime failures, so they are warned
about once rather than once per request, which would otherwise repeat on every scroll. The trade is that
the message states the contract instead of naming the offending entry.

A month that failed is left absent rather than recorded as empty, so the next range request asks about it
again. Recording a failure as an empty month would cache "nothing is disabled" as authoritative for the
rest of the session, and treating an empty month as a failure would re-request every month a provider
reports nothing for, which for most providers is most months. A transient failure therefore heals on the
next scroll or reopen. Asking again marks the month pending, which is what makes it render as pending
while the retry is in flight rather than showing a spinner over dates that look settled.

A promise that never settles cannot be recovered from: its months stay pending, so they keep rendering as
pending and `isLoading()` stays true, until the cache is cleared.

### Provider identity

`setProvider` compares by reference and normalizes a missing provider to `null`, so a host forwarding an
unset property as `undefined` does not look like a change. Assigning a new function resets the cache, so
callers keep a stable reference rather than passing a fresh function on every update.
