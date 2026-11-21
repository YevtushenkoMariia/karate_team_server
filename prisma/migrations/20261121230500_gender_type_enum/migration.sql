CREATE TYPE "gender_type" AS ENUM ('MALE', 'FEMALE', 'OTHER');

ALTER TABLE "users"
ALTER COLUMN "gender" TYPE "gender_type"
USING (
    CASE
        WHEN upper(trim("gender")) IN ('MALE', 'FEMALE', 'OTHER')
            THEN upper(trim("gender"))::"gender_type"
        ELSE NULL
    END
);
