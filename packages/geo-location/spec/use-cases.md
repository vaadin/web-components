# Geo Location Use Cases

<!--
This file describes use cases for a geo-location component from the
perspective of a developer building a web application. A geo-location
component lets the application ask the browser (and, with the user's
consent, the underlying device) where the user currently is, so the
application can show, store, or react to that information.

The file does NOT describe implementation, API, properties, events,
CSS, frameworks, or technology choices — only what users want to do
with the component in a web application.
-->

## 1. Show information relevant to where I am right now

This is by far the most common reason an application reaches for location. A
user opens a page and the application wants to offer content tailored to
where the user currently is.

Typical scenarios:

- A restaurant chain's "Find a restaurant near me" page. The user clicks a
  button, the browser asks whether the site may use their location, and the
  page then shows the three closest locations with their distance and
  opening hours.
- A weather page where the user clicks "Use my location" and the forecast
  switches from a default city to the user's actual town.
- An address form with a "Use my current location" button next to the
  street field. When the user activates it, the form is pre-filled with the
  street, postal code and city the user is currently in.
- A public transport app that, when the user taps "Nearest stop", shows the
  closest bus stop and the next departures.

The user expects:

- A clear, visible control that they deliberately activate. Location is not
  collected behind their back.
- After a short wait, either the requested information appears, or a clear
  message explains why it could not (permission denied, no signal, timed out).
- Activating the same control again later gives an up-to-date position, not
  a stale one from an hour ago.
- The control behaves the same whether the user is on a desktop with
  coarse network-based positioning or on a phone with GPS.

The location itself is rarely the end product here. What the user actually
sees is a list of stores, a weather card, a pre-filled address — the
component is the bridge between "where am I" and "what should I see".

---

## 2. Continuously follow me while I am doing something

Some applications are not interested in a single snapshot of where the user
is, but in where the user is *over time*, updated as the user moves.

Typical scenarios:

- A running or cycling app that records a workout. As the user runs, the
  app shows the current pace, distance covered, and the route traced on a
  map. When the user stops the workout, tracking stops too.
- A food-delivery or courier dispatch app where the driver's device reports
  their position to the server every few seconds so that customers can see
  the courier approaching on a map.
- A field-service application where a technician's location is tracked
  during their shift and each visit is recorded against the nearest
  customer site.
- A turn-by-turn navigation screen inside a warehouse, museum, or airport
  that updates the "you are here" marker as the user walks.

The user expects:

- The application to receive a fresh position whenever they meaningfully
  move, not just once.
- To be able to clearly start and stop this continuous tracking. Tracking
  must stop when the activity ends, when the user leaves the page, or when
  the user explicitly opts out — continuous background tracking without an
  obvious way to turn it off is not acceptable.
- Updates to keep arriving even if they walk around a corner, into a
  tunnel, or briefly lose signal — and to resume automatically when the
  signal comes back.
- The battery impact to be reasonable: the app should be able to ask for
  updates only when they matter.

---

## 3. Automatically use my location when I come back

Once a user has already granted a site permission to use their location,
asking them again every single visit is annoying. Applications want to
quietly resume using the location they already have permission for.

Typical scenarios:

- A news portal the user visits every morning. The first time they visited,
  they allowed the site to use their location to show local headlines. On
  every subsequent visit, the local-news panel should simply appear,
  already populated, without any button click.
- A transit app where the homepage shows the departure board for the stop
  closest to the user. Returning users should see their nearest stop
  immediately on page load.
- A dashboard used by a field inspector whose map view should re-center on
  their current whereabouts each time they open the application in the
  morning.

The user expects:

- No extra prompt or click if permission is already in place. The location
  "just works".
- If permission has *not* already been granted (first visit, permission
  revoked, private window), the application must fall back to the explicit
  flow from use case 1 instead of silently failing or, worse, popping an
  unexpected prompt the moment the page loads.
- If the user previously denied permission, the page must not nag them on
  every load.

---

## 4. Handle users who say "no" or can't share a location

Location is one of the permissions users decline most often, and even when
they accept, the device may simply fail to produce a fix. Every application
that uses location has to cope with these situations gracefully — this is
not an edge case, it is the normal path for a significant share of users.

Typical scenarios:

- The user clicks "Find stores near me" but then denies the browser
  permission prompt. The page should not be left blank. Instead it should
  explain that location was not shared and offer an alternative, such as a
  text box to enter a postcode.
- The user is on a desktop indoors with no GPS, Wi-Fi positioning is
  unreliable, and the browser reports "position unavailable". The page
  should say something honest ("We couldn't determine your location") and
  offer the same manual fallback.
- A request takes too long and times out. The page should not spin
  forever — it should surface a retry option.
- The user previously denied permission and comes back a week later. The
  application should be able to tell them *why* the location feature is not
  working and how to re-enable it, rather than silently doing nothing.
- The page is embedded in an iframe or loaded over plain HTTP, where
  browsers block location entirely. The application should recognise that
  the feature is unavailable at all and hide the control instead of showing
  a button that can never work.

The user expects a predictable, non-hostile experience regardless of
whether location sharing succeeds, fails, or is not even possible.

---

## 5. Use detailed position data, not just latitude and longitude

Most applications only need "roughly where am I", but some need much more
from each position reading.

Typical scenarios:

- A cycling app shows the user's current speed in km/h and their elevation
  gain over the ride.
- A running app records each position's accuracy and ignores readings that
  are too imprecise to be trusted, so that a brief bad GPS fix does not add
  a kilometre-long zig-zag to the recorded route.
- A hiking app displays altitude above sea level.
- A boating or aviation-themed app shows heading ("course over ground") so
  the user can tell which way they are actually moving.
- A field data-collection app records each measurement together with the
  timestamp and accuracy of the position at which it was taken, so that
  analysts can later filter out low-confidence samples.

The user expects the component to expose all the position information the
browser provides — not only coordinates, but also the accompanying
accuracy, altitude, heading, speed and timestamp — so that these specialised
applications can make decisions based on them.

---

## 6. Trade off precision, freshness and battery

Different applications have very different tolerances for how accurate,
how fresh, and how expensive a position reading should be.

Typical scenarios:

- A news site only needs to know which city the user is in. A coarse,
  possibly cached reading from five minutes ago is perfectly fine and is
  preferable to waking up the GPS chip.
- A turn-by-turn navigation app inside a car needs the most accurate
  position the device can produce, even though it drains more battery.
- A "check in at this venue" feature needs a fresh reading — the user is
  standing in front of the venue *now*, and a cached position from an hour
  ago at their home would produce the wrong check-in.
- A form that pre-fills the user's address does not need the absolute
  latest fix and should not make the user wait 30 seconds while the GPS
  warms up; if it cannot get a reading reasonably quickly it should give
  up and let the user type the address instead.

The user (developer) expects to be able to express, on a per-use basis:

- How accurate they need the reading to be.
- How old a cached reading they are willing to accept.
- How long they are willing to wait before giving up.

Different parts of the *same* application may legitimately want different
trade-offs, so these choices cannot be a global setting.

---

## 7. Capture the user's location as part of a form

Rather than being a standalone piece of information, location is often a
field inside a larger form that the user is filling out.

Typical scenarios:

- A municipal "report a pothole" form. Alongside a photo, a description,
  and a category, there is a "Pin my location" control. When activated, it
  captures the user's current coordinates and submits them as part of the
  report.
- A field biologist logging a wildlife sighting attaches their current
  coordinates to each entry.
- A security guard doing a patrol logs "checkpoint reached" together with
  the location at which they logged it.
- An insurance claim form where the user reports an incident and the form
  records where they were when they filled it in.

The user expects:

- The captured location to behave like any other field in the form: it is
  part of what gets submitted, it can be reset when the form is reset, and
  it can be required (the form should not submit until a location has been
  captured).
- A clear visual indication of whether a location has been captured yet and
  which location it is, so they can re-capture it if they moved or if the
  first reading was wrong.
- Validation to be possible — e.g. the form can refuse to submit a report
  whose captured location is too imprecise, or is obviously outside the
  area the service covers.
