module.exports = {
    development: {
        dialect: "postgres",
        use_env_variable: 'DATABASE_URL'
    },
    test: {
        dialect: "postgres",
        use_env_variable: 'DATABASE_URL'
    },
    production: {
        dialect: 'postgres',
        use_env_variable: 'DATABASE_URL'
    }
};