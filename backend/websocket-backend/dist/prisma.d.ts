import { PrismaClient } from "./generated/prisma/index.js";
export declare const prisma: PrismaClient<{
    datasources: {
        db: {
            url: string | undefined;
        };
    };
}, never, import("./generated/prisma/runtime/library.js").DefaultArgs>;
declare const redis: any;
export default redis;
//# sourceMappingURL=prisma.d.ts.map