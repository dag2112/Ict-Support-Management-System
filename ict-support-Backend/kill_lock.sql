SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'ict_support_db' AND pid <> pg_backend_pid();
SELECT pg_advisory_unlock_all();
