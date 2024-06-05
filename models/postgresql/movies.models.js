import { randomUUID } from "node:crypto";
import { pool } from "../../db/db.js";

export class MovieModel {
  static async getAll({ genre }) {
    //Filtar la movies por genre
    if (genre) {
      const moviesFilter = await pool.query(
        "SELECT m.id, m.title, m.year, m.director, m.duration, m.poster, CAST(m.rate AS FLOAT) AS rate, ARRAY_AGG(g.name) AS genre FROM movie m JOIN moviegenre mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id WHERE g.name ILIKE $1 GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate;",
        [genre]
      );

      return moviesFilter.rows;
    }

    //Obtener todas la movies
    const moviesAll = await pool.query(
      "SELECT m.id, m.title, m.year, m.director, m.duration, m.poster, CAST(m.rate AS FLOAT) AS rate, ARRAY_AGG(g.name) AS genre FROM movie m JOIN moviegenre mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate;"
    );
    return moviesAll.rows;
  }

  //Obtener la movie por id
  static async getById({ id }) {
    const movies = await pool.query(
      "SELECT m.id, m.title, m.year, m.director, m.duration, m.poster, CAST(m.rate AS FLOAT) AS rate, ARRAY_AGG(g.name) AS genre FROM movie m JOIN moviegenre mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id WHERE m.id = $1 GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate;",
      [id]
    );
    return movies;
  }

  //Crear una nueva movie
  static async create({ data }) {
    const id = randomUUID();

    try {
      await pool.query(
        "INSERT INTO movie VALUES($1, $2, $3, $4, $5, $6, $7);",
        [
          id,
          data.title,
          data.year,
          data.director,
          data.duration,
          data.poster,
          data.rate,
        ]
      );

      data.genre.forEach((genre) => {
        pool.query(
          "INSERT INTO moviegenre (movie_id, genre_id) VALUES ($1, (SELECT id FROM genre WHERE LOWER(name) = LOWER($2)));",
          [id, genre]
        );
      });
    } catch (error) {
      throw new Error("Error creating movie");
    }

    return this.getById({ id });
  }

  //Actualizar una movie
  static async update({ id, data }) {
    const updateMovie = await pool.query(
      "UPDATE movie SET title = $1, year = $2, director = $3, duration = $4, poster = $5, rate = $6 WHERE id = $7 RETURNING *;",
      [
        data.title,
        data.year,
        data.director,
        data.duration,
        data.poster,
        data.rate,
        id,
      ]
    );

    return updateMovie;
  }

  static async delete({ id }) {
    const result = await pool.query("DELETE FROM movie WHERE id = $1;", [id]);

    return result;
  }
}
