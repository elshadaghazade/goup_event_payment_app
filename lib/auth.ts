import { NextRequest } from "next/server";

export async function isAuthenticated (request: NextRequest): Promise<boolean> {
    return true;
}