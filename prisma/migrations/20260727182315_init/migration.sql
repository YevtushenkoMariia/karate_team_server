-- CreateEnum
CREATE TYPE "competition_type" AS ENUM ('KATA', 'KUMITE', 'TEAM_KATA');

-- CreateEnum
CREATE TYPE "karate_level_type" AS ENUM ('10_KYU', '9_KYU', '8_KYU', '7_KYU', '6_KYU', '5_KYU', '4_KYU', '3_KYU', '2_KYU', '1_KYU', '1_DAN', '2_DAN', '3_DAN', '4_DAN', '5_DAN', '6_DAN', '7_DAN', '8_DAN', '9_DAN', '10_DAN');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('ADMIN', 'COACH', 'SPORTSMAN');

-- CreateEnum
CREATE TYPE "sportsman_role_type" AS ENUM ('JUST_TRAIN', 'RESERVE', 'NATIONAL_TEAM');

-- CreateEnum
CREATE TYPE "task_status_type" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'SKIPPED');

-- CreateEnum
CREATE TYPE "user_status_type" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED', 'VERIFYING');

-- CreateEnum
CREATE TYPE "week_day_type" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "championship_id" INTEGER,
    "category" VARCHAR(80),
    "place" INTEGER,
    "competition_type" "competition_type",
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "championships" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "city_id" INTEGER,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "championships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country_id" INTEGER,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "city_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_sportsman" (
    "coach_id" INTEGER NOT NULL,
    "sportsman_id" INTEGER NOT NULL,

    CONSTRAINT "coach_sportsman_pkey" PRIMARY KEY ("coach_id","sportsman_id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "user_id" INTEGER NOT NULL,
    "karate_level" "karate_level_type",
    "city_id" INTEGER,
    "club_id" INTEGER,
    "position" VARCHAR(100),
    "specialization" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "code" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_reports" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "physical_state_grade" INTEGER,
    "physical_state_comment" TEXT,
    "emotional_state_grade" INTEGER,
    "emotional_state_comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sportsmen" (
    "user_id" INTEGER NOT NULL,
    "karate_level" "karate_level_type",
    "city_id" INTEGER,
    "club_id" INTEGER,
    "status" "sportsman_role_type" DEFAULT 'JUST_TRAIN',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sportsmen_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "task_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "task_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plan_groups" (
    "plan_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "training_plan_groups_pkey" PRIMARY KEY ("plan_id","group_id")
);

-- CreateTable
CREATE TABLE "training_plan_users" (
    "plan_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "training_plan_users_pkey" PRIMARY KEY ("plan_id","user_id")
);

-- CreateTable
CREATE TABLE "training_plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_task_reports" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "status" "task_status_type" DEFAULT 'TODO',
    "video_url" VARCHAR(255),
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_task_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_tasks" (
    "id" SERIAL NOT NULL,
    "task_order" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "week_day" "week_day_type",
    "category_id" INTEGER,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER,
    "repeat_number" INTEGER DEFAULT 0,
    "sets_number" INTEGER DEFAULT 0,
    "video_url" VARCHAR(255),
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "surname" VARCHAR(60) NOT NULL,
    "gender" VARCHAR(10),
    "role" "role_type" NOT NULL DEFAULT 'SPORTSMAN',
    "phone_number" VARCHAR(20),
    "birth_date" DATE,
    "status" "user_status_type" NOT NULL DEFAULT 'VERIFYING',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_groups" (
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_groups_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateIndex
CREATE INDEX "idx_championships_city_id" ON "championships"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE INDEX "idx_cities_country_id" ON "cities"("country_id");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE INDEX "idx_coach_sportsman_sportsman_id" ON "coach_sportsman"("sportsman_id");

-- CreateIndex
CREATE INDEX "idx_coaches_city_id" ON "coaches"("city_id");

-- CreateIndex
CREATE INDEX "idx_coaches_club_id" ON "coaches"("club_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_code_key" ON "groups"("code");

-- CreateIndex
CREATE INDEX "idx_sportsmen_city_id" ON "sportsmen"("city_id");

-- CreateIndex
CREATE INDEX "idx_sportsmen_club_id" ON "sportsmen"("club_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_categories_name_key" ON "task_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "training_task_reports_task_id_author_id_key" ON "training_task_reports"("task_id", "author_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_championship_id_fkey" FOREIGN KEY ("championship_id") REFERENCES "championships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "championships" ADD CONSTRAINT "championships_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach_sportsman" ADD CONSTRAINT "coach_sportsman_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach_sportsman" ADD CONSTRAINT "coach_sportsman_sportsman_id_fkey" FOREIGN KEY ("sportsman_id") REFERENCES "sportsmen"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "health_reports" ADD CONSTRAINT "health_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sportsmen" ADD CONSTRAINT "sportsmen_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sportsmen" ADD CONSTRAINT "sportsmen_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sportsmen" ADD CONSTRAINT "sportsmen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_plan_groups" ADD CONSTRAINT "training_plan_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_plan_groups" ADD CONSTRAINT "training_plan_groups_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_plan_users" ADD CONSTRAINT "training_plan_users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_plan_users" ADD CONSTRAINT "training_plan_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_task_reports" ADD CONSTRAINT "training_task_reports_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_task_reports" ADD CONSTRAINT "training_task_reports_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "training_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_tasks" ADD CONSTRAINT "training_tasks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "task_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_tasks" ADD CONSTRAINT "training_tasks_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
