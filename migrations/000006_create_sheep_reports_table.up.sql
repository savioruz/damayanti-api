CREATE TABLE IF NOT EXISTS sheep_reports (
    id VARCHAR(36) PRIMARY KEY,
    sheep_id VARCHAR(36) NOT NULL,
    feeding_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(36) NOT NULL,
    modified_by VARCHAR(36) NOT NULL
);

ALTER TABLE sheep_reports
ADD CONSTRAINT fk_sheep FOREIGN KEY (sheep_id) REFERENCES sheeps(id)
ON UPDATE CASCADE ON DELETE RESTRICT;
