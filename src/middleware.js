export { default } from "next-auth/middleware";
export const config = {
    matcher: [
      '/((?!login|/|api|_next/static|images|favicon.ico).*)',
    ]}