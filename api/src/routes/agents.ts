/**
 * Agent routes
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";

export const agentRoutes = new Hono();

agentRoutes.get("/", (c) => {
  return c.json({ agents: [], total: 0 });
});

agentRoutes.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ agentId: id, status: "placeholder" });
});
