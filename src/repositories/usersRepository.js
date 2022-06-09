import db from './../config/database.js';
import sqlstring from 'sqlstring';

export default class UsersRepository {
    static createUser = async ({ name, email, password }) => {
        const query = sqlstring.format(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );

        const { rows } = await db.query(query);
        return rows[0];
    };

    static getUserByEmail = async (email) => {
        const query = sqlstring.format('SELECT * FROM users WHERE email = ?', [
            email,
        ]);

        const { rows } = await db.query(query);
        return rows[0];
    };

    static getUserById = async (id) => {
        const query = sqlstring.format('SELECT * FROM users WHERE id = ?', [
            id,
        ]);

        const { rows } = await db.query(query);
        return rows[0];
    };

    static getUserByIdWithUrlsRelationship = async (id) => {
        const query = sqlstring.format(
            `SELECT * FROM users WHERE id = ?',
        users.name,
        SUM(urls."visitCount") AS "visitCount",
        json_agg(json_build_object(
            "id", urls.id,
            "url", urls.url,
            "title", urls.title,
            "visitCount", urls."visitCount"
        )) AS "shortnedUrls"
        FROM users
        LEFT JOIN urls ON urls.userId = users.id
        WHERE users.id = ?
        GROUP BY users.id, users.name`,
            [id]
        );

        const { rows } = await db.query(query);
        return rows[0];
    };

    static getUsersVisitCountRanking = async () => {
        const query = sqlstring.format(
            `SELECT users.id,
            users.name,
            COUNT(urls.id) AS "linksCount",
            COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
            FROM users
            LEFT JOIN urls ON urls.userId = users.id
            GROUP BY users.id, users.name
            ORDER BY "visitCount" DESC, "linksCount" DESC
            LIMIT 10`
        );

        const { rows } = await db.query(query);
        return rows;
    };
}
