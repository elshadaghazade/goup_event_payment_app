import { NextRequestWithUser } from "@/app/interfaces/User";
import { User } from '@/prisma/client/client_users';
import { createHttpErrorResponse } from "../responses";
import { ClientError } from "../interfaces/ClientError";



export const CheckJWT = () => {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const user = new User();

        descriptor.value = async (req: NextRequestWithUser, params: any) => {
            try {
                const accessToken = req.headers.get('authorization')?.replace(/bearer/gi, '')?.trim();

                if (!accessToken) {
                    throw new ClientError("TOKEN_IS_MISSING", 401);
                }

                const userId = await user.getUserIdFromAccessToken(accessToken);

                req.user = {
                    userId
                }

                return originalMethod(req, params);
            } catch (err: any) {
                return createHttpErrorResponse(err);
            }
        }
    }
}