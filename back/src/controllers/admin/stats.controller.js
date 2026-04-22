import { success } from "../../utils/response.js";
import { getStats } from "../../services/admin/stats.service.js";

/* =========================
   GET /admin/stats
========================= */
export const getStatsController = async (req, res, next) => {
  try {
    const stats = await getStats();
    return success(res, stats);
  } catch (e) {
    next(e);
  }
};