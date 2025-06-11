-- Create tables for different types of loans

-- Users table to store basic user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_user_id VARCHAR(128) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal Loans table
CREATE TABLE personal_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    firebase_user_id VARCHAR(128) NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    loan_tenure_months INTEGER NOT NULL,
    monthly_income DECIMAL(12,2) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    credit_score INTEGER,
    existing_loans DECIMAL(12,2) DEFAULT 0,
    eligibility_status BOOLEAN,
    interest_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Home Loans table
CREATE TABLE home_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    firebase_user_id VARCHAR(128) NOT NULL,
    property_value DECIMAL(12,2) NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    loan_tenure_years INTEGER NOT NULL,
    monthly_income DECIMAL(12,2) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    credit_score INTEGER,
    property_type VARCHAR(50) NOT NULL,
    property_location VARCHAR(100) NOT NULL,
    eligibility_status BOOLEAN,
    interest_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Against Mutual Funds table
CREATE TABLE loan_against_mutual_funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    firebase_user_id VARCHAR(128) NOT NULL,
    mutual_fund_portfolio_value DECIMAL(12,2) NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    loan_tenure_months INTEGER NOT NULL,
    mutual_fund_holdings JSONB NOT NULL, -- Stores details of mutual fund holdings
    eligibility_status BOOLEAN,
    interest_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Loans table
CREATE TABLE education_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    firebase_user_id VARCHAR(128) NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    has_college_letter BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example insert statements for testing

-- Insert a user
INSERT INTO users (firebase_user_id, first_name, last_name, email, phone_number, date_of_birth)
VALUES ('firebase_uid_123', 'John', 'Doe', 'john.doe@example.com', '1234567890', '1990-01-01');

-- Insert a personal loan application
INSERT INTO personal_loans (
    user_id,
    firebase_user_id,
    loan_amount,
    loan_tenure_months,
    monthly_income,
    employment_type,
    credit_score,
    existing_loans,
    eligibility_status,
    interest_rate
)
VALUES (
    (SELECT id FROM users WHERE firebase_user_id = 'firebase_uid_123'),
    'firebase_uid_123',
    50000.00,
    24,
    75000.00,
    'SALARIED',
    750,
    0.00,
    true,
    12.5
);

-- Insert a home loan application
INSERT INTO home_loans (
    user_id,
    firebase_user_id,
    property_value,
    loan_amount,
    loan_tenure_years,
    monthly_income,
    employment_type,
    credit_score,
    property_type,
    property_location,
    eligibility_status,
    interest_rate
)
VALUES (
    (SELECT id FROM users WHERE firebase_user_id = 'firebase_uid_123'),
    'firebase_uid_123',
    5000000.00,
    4000000.00,
    20,
    150000.00,
    'SALARIED',
    780,
    'APARTMENT',
    'Mumbai',
    true,
    8.5
);

-- Insert a loan against mutual funds application
INSERT INTO loan_against_mutual_funds (
    user_id,
    firebase_user_id,
    mutual_fund_portfolio_value,
    loan_amount,
    loan_tenure_months,
    mutual_fund_holdings,
    eligibility_status,
    interest_rate
)
VALUES (
    (SELECT id FROM users WHERE firebase_user_id = 'firebase_uid_123'),
    'firebase_uid_123',
    1000000.00,
    500000.00,
    12,
    '[
        {"fund_name": "ABC Equity Fund", "units": 1000, "nav": 50.00},
        {"fund_name": "XYZ Debt Fund", "units": 2000, "nav": 25.00}
    ]',
    true,
    10.5
); 