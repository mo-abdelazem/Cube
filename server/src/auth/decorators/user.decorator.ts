import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

// ✅ Define the authenticated request interface
interface AuthenticatedRequest {
  user: UserPayload;
}

export const User = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new Error(
        'User not found in request. Ensure JWT guard is applied.',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
