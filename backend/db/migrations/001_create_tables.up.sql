-- Departments table
CREATE TABLE departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  contact TEXT NOT NULL,
  blood_type TEXT,
  address TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualifications TEXT,
  department_id BIGINT REFERENCES departments(id),
  contact TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  doctor_id BIGINT NOT NULL REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions table
CREATE TABLE prescriptions (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT REFERENCES appointments(id),
  patient_id BIGINT NOT NULL REFERENCES patients(id),
  doctor_id BIGINT NOT NULL REFERENCES doctors(id),
  medications TEXT NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system'),
  ('Pediatrics', 'Medical care for infants, children, and adolescents'),
  ('Orthopedics', 'Musculoskeletal system'),
  ('Neurology', 'Nervous system disorders'),
  ('General Medicine', 'General medical conditions');
