import { RefreshTokenService } from '@modules/users/services/RefreshTokenService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class RefreshTokenController {
  async create(request: Request, response: Response): Promise<Response> {
    const token =
      request.body.token ||
      request.headers['x-access-token'] ||
      request.query.token;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const refresh_token = await refreshTokenService.execute(token);

    return response.json(refresh_token);
  }
}

export { RefreshTokenController };
