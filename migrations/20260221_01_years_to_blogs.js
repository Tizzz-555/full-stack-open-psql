const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE blogs
      ADD CONSTRAINT blogs_year_check
      CHECK (year >= 1991 AND year <= EXTRACT(YEAR FROM CURRENT_DATE))
    `);
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
