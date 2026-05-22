import { describe, it, expect, vi, beforeAll } from 'vitest';

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('Response Utils', () => {
  let response;

  beforeAll(async () => {
    response = await import('../utils/response.js');
  });

  it('success returns 200 with data', () => {
    const res = mockRes();
    response.success(res, { foo: 'bar' }, 'OK');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: { foo: 'bar' }, message: 'OK' })
    );
  });

  it('created returns 201', () => {
    const res = mockRes();
    response.created(res, { id: '1' }, 'Created');
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('error returns correct status with message', () => {
    const res = mockRes();
    response.error(res, 'Not found', 404);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Not found' })
    );
  });

  it('paginated returns pagination object', () => {
    const res = mockRes();
    response.paginated(res, ['item'], { hasMore: false, nextCursor: null });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: ['item'], pagination: { hasMore: false, nextCursor: null } })
    );
  });

  it('notFound returns 404', () => {
    const res = mockRes();
    response.notFound(res, 'Transaction');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Transaction not found.' })
    );
  });
});
