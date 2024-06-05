import { createApp } from "./app.js";
import { MovieModel } from "./models/local-system-storage/movies.models.js";

createApp({ movieModel: MovieModel });
