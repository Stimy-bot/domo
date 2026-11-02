// apps/my_start/src/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';

export default createStartHandler(defaultStreamHandler);
