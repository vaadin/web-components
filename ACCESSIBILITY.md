# Accessibility

Accessibility is a top priority for Vaadin. We build all user-facing features according to [WCAG 2.1](https://www.w3.org/TR/WCAG21/) level AA criteria, using semantic HTML and [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) features and techniques.

Most of existing digital accessibility laws worldwide, such as the European Accessibility Act and Section 508, base their requirements on WCAG level AA. Check out [Vaadin accessibility page](https://vaadin.com/accessibility) for more information on accessibility standards and legislation.

## How we test

- We test new UI features with screen readers during development and before each release.
- The reputable accessibility agency [TetraLogical](https://tetralogical.com) tests Vaadin web components once a year.
- We add known accessibility issues to our backlog and fix them as part of regular maintenance.

## Recommended environments

The following screen reader and browser combinations are used to test Vaadin UI features and are recommended for use with Vaadin-based applications:

- NVDA with Chrome or Firefox on Windows
- JAWS with Chrome or Firefox on Windows
- VoiceOver with Safari on macOS
- VoiceOver with Safari on iOS

## Component conformance

Check out the [accessibility overview table](https://docs.google.com/spreadsheets/d/1VJuzr1H2BWxPAGdtLxTe7yj12_vn0RcTu-UO79WOp8w/edit?usp=sharing) for the WCAG 2.1 level A and AA status of each component included to recent versions of the Vaadin platform. Most issue cells link to the related GitHub issues.

## Reporting issues

Find open accessibility issues with the `a11y` label:

- [Web components](https://github.com/vaadin/web-components/issues?q=is%3Aissue+is%3Aopen+label%3Aa11y)
- [Flow components](https://github.com/vaadin/flow-components/issues?q=is%3Aissue+is%3Aopen+label%3Aa11y)

If you find an accessibility issue, file an [accessibility bug report](https://github.com/vaadin/web-components/issues/new?labels=a11y&template=a11y-test-finding.yml).

## Enterprise

Accessibility review is available as part of [Vaadin Enterprise Edition](https://vaadin.com/enterprise), with a certificate and an Accessibility Conformance Report (VPAT) covering WCAG 2.1 Level AA, Section 508, and EN 301 549.

Enterprise subscribers can use the [bugfix warranty](https://vaadin.com/solutions/support) to prioritize accessibility issues.

## Contributing

Read the [accessibility guidelines](guidelines/a11y.md) before you change a component. They describe roles, labels, focus and keyboard support. See also [CONTRIBUTING.md](CONTRIBUTING.md).

Real screen reader support takes priority over WCAG conformance. A fix must work in all supported environments listed above.

## Learn more

Accessible components alone do not make an application accessible. Developers must use the components in accessible ways. Layouts and styling must also give enough color contrast, keyboard support and screen reader support.

Check out the following posts on the Vaadin blog:

- [Basic Tips for Improving Accessibility](https://vaadin.com/blog/basic-tips-for-improving-accessibility)
- [How We Built an Accessible Dashboard Component](https://vaadin.com/blog/how-we-built-an-accessible-dashboard-component)
