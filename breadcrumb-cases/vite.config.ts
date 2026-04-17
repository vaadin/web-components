import type { UserConfigFn } from 'vite';
import { overrideVaadinConfig, useLocalWebComponents } from './vite.generated';

const customConfig: UserConfigFn = () => ({
  plugins: [useLocalWebComponents('..')],
});
export default overrideVaadinConfig(customConfig);
