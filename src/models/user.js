const pool = require("../db/connection");

class User {
  static async getUserByEmailOrMobile(email, mobileNumber) {
    try {
      const query = `
                SELECT *
                FROM users
                WHERE email = $1 AND mobile_number = $2;
            `;
      const values = [email, mobileNumber];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async searchUsers(searchString, minAge, maxAge, city) {
    try {
      let query = `
                SELECT u.*
                FROM users u
                JOIN addresses a ON u.user_id = a.user_id
                WHERE (LOWER(u.first_name) LIKE $1
                OR LOWER(u.last_name) LIKE $1
                OR LOWER(u.email) LIKE $1)`;

      const params = [`%${searchString}%`];

      if (minAge !== undefined) {
        query +=
          " AND DATE_PART('year', age(u.birthdate)) >= $" + (params.length + 1);
        params.push(minAge);
      }

      if (maxAge !== undefined) {
        query +=
          " AND DATE_PART('year', age(u.birthdate)) <= $" + (params.length + 1);
        params.push(maxAge);
      }

      if (city) {
        query += " AND LOWER(a.city) = $" + (params.length + 1);
        params.push(city.toLowerCase());
      }

      const { rows } = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      // Update user information in the users table
      const updateUserQuery = `
            UPDATE users
            SET first_name = $1, last_name = $2, email = $3, mobile_number = $4, birthdate = $5
            WHERE user_id = $6
            RETURNING *;
        `;
      const updateUserValues = [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.mobile_number,
        userData.birthdate,
        userId,
      ];

      const { rows } = await pool.query(updateUserQuery, updateUserValues);
      const updatedUser = rows[0];

      // If address is provided, update it as well
      if (userData.address) {
        const updateAddressQuery = `
                    UPDATE addresses
                    SET address_line_1 = $1, address_line_2 = $2, pincode = $3, city = $4, state = $5, type = $6
                    WHERE user_id = $7
                    RETURNING *;
                `;
        const updateAddressValues = [
          userData.address.address_line_1,
          userData.address.address_line_2,
          userData.address.pincode,
          userData.address.city,
          userData.address.state,
          userData.address.type,
          userId,
        ];

        const addressResult = await pool.query(
          updateAddressQuery,
          updateAddressValues
        );
        updatedUser.address = addressResult.rows[0];
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
