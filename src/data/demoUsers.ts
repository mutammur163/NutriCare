// =============================================================================
// DEMO USER ACCOUNTS — HARDCODED FOR DEMONSTRATION ONLY
// In a production deployment, these must be replaced with a proper
// authentication backend (e.g., OAuth, JWT-based API).
// =============================================================================

import type { DemoUser } from '../types';

export interface DemoCredential {
  email: string;
  password: string;
  user: DemoUser;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: 'worker@anganwadi.demo',
    password: 'Worker@123',
    user: {
      id: 'user-worker-01',
      email: 'worker@anganwadi.demo',
      name: 'Lakshmi Devi',
      role: 'worker',
      centreId: 'centre-01',
    },
  },
  {
    email: 'supervisor@anganwadi.demo',
    password: 'Supervisor@123',
    user: {
      id: 'user-supervisor-01',
      email: 'supervisor@anganwadi.demo',
      name: 'Rajesh Kumar',
      role: 'supervisor',
      centreId: 'centre-01',
    },
  },
  {
    email: 'parent@anganwadi.demo',
    password: 'Parent@123',
    user: {
      id: 'user-parent-01',
      email: 'parent@anganwadi.demo',
      name: 'Sunita Sharma',
      role: 'parent',
      centreId: 'centre-01',
      linkedChildId: 'child-001',
    },
  },
];
