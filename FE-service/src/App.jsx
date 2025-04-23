import React from "react"; // Removed useEffect import
import { Navigate, Route, Routes } from "react-router-dom";
import clsx from "clsx";
import PokemonList from "./subpages/home/PokemonList";
import FavouritesPage from "./subpages/favourites/FavouritesPage";
import ArenaPage from "./subpages/arena/ArenaPage";
import RankingPage from "./subpages/ranking/RankingPage";
import EditPage from "./subpages/edit/EditPage";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Header } from "./Header.jsx";

const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loading.container}>
        <p className={styles.loading.para}>Ładowanie aplikacji...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      {/* Main Content Area with Routing */}
      <main className="flex-grow overflow-y-auto">
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              <div className="container mx-auto p-4">
                <PokemonList />
              </div>
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/favourites"
              element={
                <div className="container mx-auto p-4">
                  <FavouritesPage />
                </div>
              }
            />
            <Route path="/arena" element={<ArenaPage />} />
            <Route
              path="/ranking"
              element={
                <div className="container mx-auto p-4 h-full">
                  <RankingPage />
                </div>
              }
            />
            <Route path="/edit" element={<EditPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        Pokedex Project &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;

const styles = {
  loading: {
    container:
      "h-screen flex justify-center items-center bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker",
    para: "text-xl text-pokemon-blue dark:text-pokemon-blue-light animate-pulse",
  },
  loadingContainer:
    "h-screen flex justify-center items-center bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker",
  container: clsx(
    "h-screen flex flex-col",
    "transition-colors duration-300 ease-in-out",
    "bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker",
    "text-pokemon-gray-darker dark:text-pokemon-gray-light",
  ),
  footer: clsx(
    "text-center p-3 text-sm",
    "transition-colors duration-300 ease-in-out",
    "bg-pokemon-blue dark:bg-pokemon-blue-dark",
    "text-pokemon-yellow-light dark:text-pokemon-yellow-light",
    "flex-shrink-0",
  ),
};
