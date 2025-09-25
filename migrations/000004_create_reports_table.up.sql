CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    container_id VARCHAR(36) NOT NULL,
    sensor_data_id VARCHAR(36) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(36) NOT NULL,
    modified_by VARCHAR(36) NOT NULL
);

ALTER TABLE reports
ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE reports
ADD CONSTRAINT fk_container FOREIGN KEY (container_id) REFERENCES containers(id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE reports
ADD CONSTRAINT fk_sensor_data FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id)
ON UPDATE CASCADE ON DELETE RESTRICT;
