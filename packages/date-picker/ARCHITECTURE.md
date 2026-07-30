# Date Picker — Architecture

Notes on the parts of `<vaadin-date-picker>` whose design is not obvious from the code. Currently covers
date metadata resolution: `DateMetadataController` decides which ranges to request, caches the answers, and
notifies whoever reads them.

> The controller is not wired into the component yet. Paragraphs marked _planned_ describe the integration
> it is built for, which lands separately.

## What the provider is for

`isDateDisabled` answers one date at a time and synchronously, which cannot be backed by a server.
`dateMetadataProvider` is its asynchronous, batched counterpart: it is called for a **range** of dates and
may return a promise, so the answer can come from a backend.

One function returns all of a date's metadata, rather than a generator per concern. A single backend query
can then answer everything instead of making a pass per concern. Only the disabled state is read today;
further metadata extends the same entry shape.

`setProvider` compares by reference, and normalizes a missing provider to `null` so that a host forwarding
an unset property as `undefined` does not look like a change. Assigning a new function resets the cache.
Callers are expected to keep a stable reference instead of passing a fresh function on every update.

## Where the cache lives

The date-picker element owns the controller, not the overlay content — which exists only once the overlay
has been opened. Keeping it on the element is what makes the cache survive opening and closing.

The month calendars therefore read a controller they do not own. That is why change notification is
explicit rather than a property assignment (see [How consumers are notified](#how-consumers-are-notified)).

_Planned:_ validating a value that was set or typed without ever opening the overlay needs the metadata
too, which is only possible with the cache on the element. Validation does not consult the provider yet.

## Which months are requested

`ensureRangeLoaded(start, end)` rounds the requested range out to whole blocks of `BLOCK_MONTHS` (12),
skips the months already loaded or in flight, and asks for what is left with a **single call**, narrowed to
the first and last of them.

Blocks are counted from January of year 0, so one block is exactly one calendar year. A month is rounded
**down** to its block and never towards zero, which keeps a date before year 0 in the block it belongs to.

Rounding out to a block is what makes navigating cheap. A buffer centred on the request travels with it and
never gets ahead of the user: step forward one month and one new month falls off the far edge, which is one
more request. Stepping through a year that way costs a request per month. Inside a block nothing is
missing, so it costs nothing.

Fixed blocks have a second benefit. Every caller asks for the same ranges, which a server can cache; ranges
centred on wherever the user happens to be looking are all slightly different, and cannot be.

Narrowing keeps a call to what is missing. When an answered block sits between two missing ones, the range
covers it instead of splitting into a call per gap — one round trip for a slightly wider range.

The controller does not coalesce calls: each one that finds a missing month issues its own request, so a
caller that loads while the user navigates has to debounce. That covers a fast scroll, where many positions
pass in a single gesture. It does nothing for deliberate month-at-a-time stepping, which is slower than any
window worth setting — block alignment is what covers that.

## What the cache holds

A month is pending, resolved, or absent, and has no record at all until it is loaded. Absent is therefore
exactly what needs loading, which is also why a failure removes the months it covered instead of marking
them.

Whether a month is still pending and what it holds live in the same record, so the two cannot disagree.
`isLoading()` is derived by looking for a pending month rather than counted separately, for the same
reason.

Every pending month shares one frozen record, because a month being fetched has nothing of its own to hold:
only a resolved month is ever read for entries. Anything that had to be remembered per month while in
flight would need a record per month again.

A call marks as pending, and later writes, only the months it is loading — never the ones its range merely
covers. An answered month keeps its metadata while the wider reply is in flight, which is what stops a date
known to be disabled from turning selectable again partway through a scroll.

Only being loaded resolves a month. Metadata the provider volunteers for any other month is dropped,
including for a month the range covered, leaving a month's own answer as the only thing that can decide its
dates.

Resolving a month writes a fresh record, replacing its entries rather than merging into them: a month's own
answer is complete by definition. Today a resolved month is only re-requested after `clearCache()`, which
drops it first, so replace and merge cannot be told apart through the API. Replacing is what keeps that
true if a per-month refresh is ever added.

## Which dates count as disabled

The controller's `isDateDisabled` is true when the date's month is resolved **and** its metadata says so. A
date whose month is still being fetched is not disabled; it is re-checked when the month resolves.

Being optimistic and correcting afterwards keeps rendering, selection and validation consistent with each
other, because all three read the same predicate. The alternative — treating an unresolved date as unusable
— would make the whole visible calendar go dead while a slow provider answers, and report a value invalid
on every fresh load, before anything is known about it.

_Planned:_ dates in a month that is still loading render with a `pending` part while a loading indicator is
shown, but they stay selectable.

## How consumers are notified

**Subscribers are invalidated synchronously** with `requestUpdate()`. A subscriber has to render from its
bindings: `requestUpdate()` leaves the changed properties empty, so `PolylitMixin` does not re-run
observers, and state applied imperatively from an observer is refreshed from the host callback instead. A
subscriber also must not be the element whose own observer triggered the load, or it invalidates itself
mid-update.

There is no `unsubscribe`; a subscriber is retained for the controller's lifetime. _Planned:_ the month
scroller creates its pool of calendars once and afterwards only reassigns which month each one shows, so
every subscriber lives as long as the controller's host.

**The host callback is deferred by one microtask, and coalesced.** Loads are triggered from observers that
run inside a Lit update, and the host reacts by writing reactive state of its own. Writing reactive state
during an update logs Lit's `change-in-update` warning and makes `updateComplete` resolve to `false`, which
is a source of one-tick-late test failures. Coalescing then means that several requests starting in one
task, or several of them resolving in one task, cost one callback instead of one per month range.

The provider's answer is awaited whether it is a promise or a plain array. A request therefore always
resolves in a later task than the one it started in, and a provider's failure is contained in one place.

## How long a request lives

Requests carry a generation counter that only `clearCache()` advances. An answer from a superseded
generation is discarded. An answer from the current generation is applied even if the host was detached
meanwhile, since discarding it would only re-fetch the same range.

There is therefore no disconnect handling. `hostConnected()` re-notifies instead, because notifications are
skipped while the host is disconnected, and state that resolved in the meantime would never reach it.

## What happens when the provider fails

A provider that throws or rejects is treated as no metadata for those months: the error is logged, the
months are dropped from the cache, and nothing is disabled. Dropping months prevents them from rendering
as stuck in pending state. The error itself must not escape the scroll or render path that triggered the load.
Applying a result is kept outside that error handling, so an exception from a subscriber is not reported as
a provider failure.

A failed month is left absent instead of being recorded as empty, so the next range request asks about it
again and a transient failure heals on the next scroll or reopen. Recording it as empty would cache
"nothing is disabled" as authoritative for the rest of the session; treating an empty month as a failure
would re-request every month a provider reports nothing for, which for most providers is most months.
Asking again marks the month pending, which is what makes it render as pending while the retry is in flight
rather than showing a spinner over dates that look settled.

A promise that never settles cannot be recovered from. Its months stay pending, so they keep rendering as
pending and `isLoading()` stays true, until the cache is cleared.

### When the provider is written wrong

A result that is not an array, and an entry that does not describe a real date, are reported rather than
ignored: ignoring them would present a provider bug as "nothing is disabled".

Entries are checked by rebuilding the date and comparing it back, which catches a month outside 0–11, a day
outside its month, and February 30 alike — each would otherwise be stored under a key that no lookup can
produce. A month given 1-based cannot be caught this way, being a valid month number, so the 0-based
contract is stated on the provider type instead.

The three fields are type-checked before that, which is not redundant. A value that cannot be coerced to a
number (e.g. bigint) throws while the date is being rebuilt; because the answer is applied inside the
error handling above, one such entry would discard the whole range and have it requested again on every
navigation, instead of costing only itself.

Both are mistakes in how the provider is written rather than runtime failures, so they are warned about
once instead of once per request, which would otherwise repeat on every scroll. The trade is that the
message states the contract instead of naming the offending entry.
