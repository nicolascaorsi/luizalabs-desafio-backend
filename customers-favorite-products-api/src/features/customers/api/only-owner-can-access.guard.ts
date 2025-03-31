import { IS_PUBLIC_KEY } from '@auth/api/decorators/public.decorator';
import { TokenData } from '@auth/api/token-data';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class OnlyOwnerCanAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.isPublicRoute(context)) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authenticatedUser: TokenData = request['user'];
    if (!authenticatedUser) {
      throw new UnauthorizedException();
    }

    const customerId = request.params['id'];
    const authenticatedCustomerId = authenticatedUser.sub;
    if (customerId != authenticatedCustomerId) {
      throw new ForbiddenException();
    }
    return true;
  }

  private isPublicRoute(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
