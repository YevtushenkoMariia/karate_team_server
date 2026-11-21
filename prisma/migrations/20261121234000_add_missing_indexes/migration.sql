-- These indexes are in the baseline for new databases; IF NOT EXISTS also
-- adds them to existing databases that were baselined before they existed.
CREATE INDEX IF NOT EXISTS "idx_championships_city_id" ON "championships"("city_id");
CREATE INDEX IF NOT EXISTS "idx_cities_country_id" ON "cities"("country_id");
CREATE INDEX IF NOT EXISTS "idx_coach_sportsman_sportsman_id" ON "coach_sportsman"("sportsman_id");
CREATE INDEX IF NOT EXISTS "idx_coaches_city_id" ON "coaches"("city_id");
CREATE INDEX IF NOT EXISTS "idx_coaches_club_id" ON "coaches"("club_id");
CREATE INDEX IF NOT EXISTS "idx_sportsmen_city_id" ON "sportsmen"("city_id");
CREATE INDEX IF NOT EXISTS "idx_sportsmen_club_id" ON "sportsmen"("club_id");
CREATE UNIQUE INDEX IF NOT EXISTS "training_task_reports_task_id_author_id_key" ON "training_task_reports"("task_id", "author_id");
