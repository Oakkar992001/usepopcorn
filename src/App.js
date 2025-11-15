import { useEffect, useState } from "react";
import StarComponent from "./StarComponent";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
// Calculating Average
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//
// Key for api
const KEY = "db797aaa";
//

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  // state for selectedID
  const [selectedID, setSelectedID] = useState(null);
  // function for selectedID
  function handleSelectedID(id) {
    setSelectedID(() => (selectedID === id ? null : id));
    console.log(selectedID);
  }
  //
  //function for back button
  function handleBackButton() {
    setSelectedID(null);
  }
  //
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
            { signal: controller.signal }
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
      handleBackButton();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  //
  return (
    <>
      <NavBar setQuery={setQuery} query={query}>
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Movies>
          {!isLoading && !error && (
            <List movies={movies} handleSelectedID={handleSelectedID} />
          )}
          {error && <ErrorMessage error={error} />}
          {!error && isLoading && <Loader />}
        </Movies>
        <Movies>
          {selectedID ? (
            <DetailMovie
              selectedID={selectedID}
              handleBackButton={handleBackButton}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedLists
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Movies>
      </Main>
    </>
  );
}
function NavBar({ children, setQuery, query }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Input setQuery={setQuery} query={query} />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Input({ setQuery, query }) {
  // const [query, setQuery] = useState("");

  // alert error

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Movies({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function List({ movies, handleSelectedID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieLists
          movie={movie}
          key={movie.imdbID}
          handleSelectedID={handleSelectedID}
        />
      ))}
    </ul>
  );
}

function MovieLists({ movie, handleSelectedID }) {
  return (
    <li key={movie.imdbID} onClick={() => handleSelectedID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedLists({ watched, handleDeleteWatched }) {
  console.log(watched);
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieLists
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovieLists({ movie, handleDeleteWatched }) {
  console.log(movie);
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
function Loader() {
  return <div className="loader">Loading ...</div>;
}
function ErrorMessage({ error }) {
  return <div className="error">{error}</div>;
}
function DetailMovie({ selectedID, handleBackButton, onAddWatched, watched }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserrating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;
  const {
    Actors: actors,
    Director: director,
    Genre: genre,
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
  } = movieDetails;
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          handleBackButton();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleBackButton]
  );
  useEffect(
    function () {
      setIsLoading(true);
      async function fetchMovieByID() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        const data = await res.json();
        console.log(data);
        setMovieDetails(data);
        setIsLoading(false);
      }

      fetchMovieByID();
    },
    [selectedID]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [selectedID]
  );
  function handleAddButton() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split("").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    handleBackButton();
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button onClick={handleBackButton} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarComponent
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating && (
                    <button
                      className="btn-add"
                      onClick={() => handleAddButton(movieDetails)}
                    >
                      +Add
                    </button>
                  )}
                </>
              ) : (
                // css
                <span className="test">
                  You rated this movie with{watchedUserrating}{" "}
                </span>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}
