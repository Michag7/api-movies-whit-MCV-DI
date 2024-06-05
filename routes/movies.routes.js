import { Router } from "express";
import { MovieController } from "../controllers/movies.controllers.js";

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  const movieController = new MovieController({
    movieModel,
  });

  moviesRouter.get("/", movieController.getAll);
  moviesRouter.get("/:id", movieController.getById);

  moviesRouter.post("/", movieController.create);

  moviesRouter.put("/:id", movieController.update);

  moviesRouter.delete("/:id", movieController.delete);

  return moviesRouter;
};
