import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkCronAuth } from './cron-auth';

describe('checkCronAuth', () => {
  const secret = 'test-secret';

  beforeEach(() => {
    vi.stubEnv('CRON_SECRET', secret);
  });

  it('returns true for valid Bearer token', () => {
    const request = new Request('http://localhost', {
      headers: { 'authorization': `Bearer ${secret}` }
    });
    expect(checkCronAuth(request)).toBe(true);
  });

  it('returns true for valid Bearer token with different casing', () => {
    const request = new Request('http://localhost', {
      headers: { 'authorization': `bearer ${secret}` }
    });
    expect(checkCronAuth(request)).toBe(true);
  });

  it('returns true for valid x-cron-secret header', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-cron-secret': secret }
    });
    expect(checkCronAuth(request)).toBe(true);
  });

  it('returns false for invalid secret', () => {
    const request = new Request('http://localhost', {
      headers: { 'authorization': 'Bearer wrong-secret' }
    });
    expect(checkCronAuth(request)).toBe(false);
  });

  it('returns false for missing secret in env', () => {
    vi.stubEnv('CRON_SECRET', '');
    const request = new Request('http://localhost', {
      headers: { 'authorization': `Bearer ${secret}` }
    });
    expect(checkCronAuth(request)).toBe(false);
  });
});
