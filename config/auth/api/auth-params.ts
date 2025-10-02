export function authParams(extra?: Record<string, string>) {
    return {
        key: process.env.API_KEY!,
        token: process.env.API_TOKEN!,
        ...(extra ?? {})    
    };
}