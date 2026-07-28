/**
 * Open WC's default entry point registers semantic DOM helpers that import
 * Web Test Runner commands. Vitest does not provide those browser commands,
 * so its browser test lane uses Open WC's supported side-effect-free entry
 * point and installs the axe assertion used by the component suites.
 */
import { chai } from '@open-wc/testing/pure';
import { chaiA11yAxe } from 'chai-a11y-axe';

chai.use(chaiA11yAxe);

export * from '@open-wc/testing/pure';
