/**
 * Reputation routes
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";

export const reputationRoutes = new Hono();

reputationRoutes.get("/:agentId", (c) => {
  const agentId = c.req.param("agentId");
  return c.json({ agentId, score: null, status: "placeholder" });
});
