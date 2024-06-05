import { validateMovie } from "../schemas/movies.schemas.js";

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });

    res.json(movies);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });

    if (movie.rowCount === 0)
      return res.status(404).json({ message: "Movie not found" });

    res.json(movie.rows[0]);
  };

  async create(req, res) {
    const result = validateMovie(req.body);
    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newMovie = await this.movieModel.create({ data: result.data });

    if (newMovie.rowCount === 0)
      return res.status(404).json({ message: "Movie dont create" });

    res.status(201).json(newMovie.rows);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const result = validateMovie(req.body);
    if (result.error)
      return res.status(404).json({ error: JSON.parse(result.error.message) });

    const updatedMovie = await this.movieModel.update({
      id,
      data: result.data,
    });

    if (updatedMovie.rowCount === 0)
      return res.status(404).json({ message: "Movie not found" });

    res.json(updatedMovie.rows[0]);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.movieModel.delete({ id });

    if (result.error)
      return res.status(404).json({ message: "Movie not found" });

    res.json({ message: "Movie deleted" });
  };
}
