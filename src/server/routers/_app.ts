import { createTRPCRouter } from "../trpc";
import { userRouter } from "./user";
import { briefRouter } from "./brief";
import { bookingRouter } from "./booking";
import { consultantRouter } from "./consultant";
import { packageRouter } from "./package";
import { toolRouter } from "./tool";
import { popupRouter } from "./popup";

export const appRouter = createTRPCRouter({
  user: userRouter,
  brief: briefRouter,
  booking: bookingRouter,
  consultant: consultantRouter,
  package: packageRouter,
  tool: toolRouter,
  popup: popupRouter,
});

export type AppRouter = typeof appRouter;
