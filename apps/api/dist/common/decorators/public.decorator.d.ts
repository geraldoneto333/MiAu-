export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export interface JwtPayload {
    sub: string;
}
export interface AuthUser {
    id: number;
    username: string;
    email: string;
}
