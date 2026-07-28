# Motion inventory and implementation guide

## Proposal implemented for #13

The pre-migration inventory identified approximately 67 transitions and 12
animations in 25 component packages and the Angular demo. Timing was mostly
literal `100–600ms` values with several unrelated cubic-bezier curves, and no
reduced-motion behavior. This change turns those declarations into the shared
motion vocabulary and keeps the visual language intentionally small.

| Category | Components | Purpose | Reduced-motion outcome |
| --- | --- | --- | --- |
| State feedback | button, checkbox, chip, radio, switch, tabs, text field | confirms press, selection, focus | instant final state |
| Spatial hierarchy | dialog, tooltip, menu, snackbar, FAB, navigation | explains where a surface appears | instant visible/hidden state |
| Content entrance | divider, list, top app bar | stages a new grouping only when requested | final layout, no stagger |
| Continuous status | loading, progress, button spinner, divider pulse | indicates ongoing work | static meaningful indicator, plus semantic status |

The system prefers `transform` and `opacity` for spatial cues. It deliberately
does not add decorative animation to static surfaces, text, or layout simply
to make them move. Color and elevation transitions remain limited to direct
interactive feedback.

## Reduced-motion verification

Use your browser/devtools to emulate `prefers-reduced-motion: reduce`. All
public duration tokens resolve to `1ms`; package-specific continuous effects
have a static alternative. Dialog, menu, tooltip, and snackbar keep their
focus, live-region, and final open/closed semantics. Menus close immediately
because their hidden state must leave the focus order; snackbars also remove
their JavaScript exit wait in reduced mode.

The Angular demo imports all generated themes and has a global reduced-motion
rule for its own view styles. The Components page provides the existing dialog,
menu, snackbar, list, loading, progress, and divider examples as a practical
motion showcase; emulate the media preference there to verify both modes.

## Contribution rules

1. Add a new timing role to `tokens/tokens.json` only when an existing public
   role cannot describe the intent.
2. Do not hard-code a duration or easing in a component stylesheet.
3. Prefer composited `transform` and `opacity`; document any non-composited
   transition as state feedback.
4. Add a reduced-motion final/static outcome for every new animation.
5. Include a focused test or token-validation assertion with the change.
