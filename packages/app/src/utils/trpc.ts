import type {AppRouter} from '@sigma-audiobooks/shared';
import {createTRPCReact} from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
