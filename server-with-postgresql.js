import { createApp } from "./app.js";
import { MovieModel } from "./models/postgresql/movies.models.js";

createApp({ movieModel: MovieModel });
