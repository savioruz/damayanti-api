CREATE TABLE IF NOT EXISTS sensor_data (
    id VARCHAR(36) PRIMARY KEY,
    container_id VARCHAR(36) NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    gas DECIMAL(5, 2) NOT NULL,
    ph DECIMAL(5, 2) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(36) NOT NULL,
    modified_by VARCHAR(36) NOT NULL
);

ALTER TABLE sensor_data
ADD CONSTRAINT fk_container FOREIGN KEY (container_id) REFERENCES containers(id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE sensor_data
ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id)
ON UPDATE CASCADE ON DELETE RESTRICT;
