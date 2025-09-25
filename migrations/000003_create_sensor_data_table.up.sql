CREATE TABLE IF NOT EXISTS sensor_data (
    id VARCHAR(36) PRIMARY KEY,
    container_id VARCHAR(36) NOT NULL,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    gas DECIMAL(5, 2),
    ph DECIMAL(5, 2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(36) NOT NULL,
    modified_by VARCHAR(36) NOT NULL
);

ALTER TABLE sensor_data
ADD CONSTRAINT fk_container FOREIGN KEY (container_id) REFERENCES containers(id)
ON UPDATE CASCADE ON DELETE RESTRICT;
