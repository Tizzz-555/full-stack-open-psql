const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    // Remove duplicate (user_id, blog_id) pairs, keeping the row with smallest id
    await queryInterface.sequelize.query(`
      DELETE FROM reading_lists a
      USING reading_lists b
      WHERE a.user_id = b.user_id
        AND a.blog_id = b.blog_id
        AND a.id > b.id
    `);

    await queryInterface.addConstraint("reading_lists", {
      fields: ["user_id", "blog_id"],
      type: "unique",
      name: "reading_lists_user_blog_unique",
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint(
      "reading_lists",
      "reading_lists_user_blog_unique",
    );
  },
};
