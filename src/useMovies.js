import { useState, useEffect } from "react";
const KEY = "db797aaa";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  // using useEffect for fetching movies with query
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          // loading true before fetching
          setIsLoading(true);
          setError("");
          //

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );
          // in case Error
          if (!res.ok) throw new Error("Error in loading movies");
          //
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          // set data into the Movie Array
          setMovies(data.Search);
          setError("");
          //
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setMovies([]);
          }
        } finally {
          // After fetching set loading False
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleBackButton();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query],
  );
  return { movies, isLoading, error };
  //
}
