export {};

// Extending Playwright's expect with a custom matcher, otherwise TypeScript will complain about not finding the definition.
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeNumber(): R;
    }
  }
}