# @banegasn/m3-form-associated

Internal shared contract used by the library's form controls. It wraps the
platform's form-associated custom element API (`ElementInternals`) and is not
intended as a standalone UI component.

The contract intentionally has no hidden-input fallback. Form association,
constraint validation, reset, and restoration are native browser behaviours;
an emulation changes their semantics. Supported engines are Chromium 77+,
Firefox 98+, and Safari 16.4+.
