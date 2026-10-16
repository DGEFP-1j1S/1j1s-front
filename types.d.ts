declare module '*.module.scss' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}

declare module 'jest-axe' {
  export function axe(html: Element | string, options?: Record<string, unknown>): Promise<import('axe-core').AxeResults>;
  export const toHaveNoViolations: {
    toHaveNoViolations(results: import('axe-core').AxeResults): { pass: boolean; message: () => string };
  };
}
