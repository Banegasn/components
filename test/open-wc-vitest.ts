/**
 * Open WC 3's default entry point installs semantic DOM snapshot helpers that
 * import Web Test Runner's browser commands. The Lit suites do not use those
 * snapshot helpers, so use the official side-effect-free Open WC entry point
 * and install the same axe Chai assertion explicitly.
 */
import { chai } from '../node_modules/@open-wc/testing/index-no-side-effects.js';
import { chaiA11yAxe } from 'chai-a11y-axe';

chai.use(chaiA11yAxe);

export * from '../node_modules/@open-wc/testing/index-no-side-effects.js';
