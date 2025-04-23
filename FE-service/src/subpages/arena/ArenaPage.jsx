import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateUserArena } from "../../services/api/pokemon.js";
import { useArenaData } from "../../hooks/useArenaData.js";
import { usePokemonFight } from "../../hooks/usePokemonFight.js";

import ArenaBackground from "../../components/Arena/ArenaBackground.jsx";
import ArenaStatusDisplay from "../../components/Arena/ArenaStatusDisplay.jsx";
import ArenaActionButtons from "../../components/Arena/ArenaActionButtons.jsx";
import ArenaSlotsContainer from "../../components/Arena/ArenaSlotsContainer.jsx";
import { capitalizeWords } from "../../utils/stringUtils.js";

const FIGHT_RESULT_DELAY = 1000;

// Component to render the fight status message (moved from ArenaStatusDisplay)
const FightStatusMessage = ({ displayFightingState, fightResultMessage }) => {
  let message = null;
  let messageClass =
    "text-center text-2xl font-bold text-white dark:text-gray-100 text-shadow-md my-4 px-4 py-2 bg-black bg-opacity-60 dark:bg-opacity-75 rounded-lg h-16 flex items-center justify-center"; // Added fixed height and flex centering

  if (fightResultMessage) {
    message = fightResultMessage;
  } else if (displayFightingState) {
    message = "Walka trwa...";
    messageClass = clsx(messageClass, "animate-pulse");
  }

  // Render only if there is a message
  return message ? (
    <div className={messageClass}>{message}</div>
  ) : (
    <div className="h-16"></div>
  ); // Render placeholder div with same height
};

const ArenaPage = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // --- State Management --- //
  const [showResultDelayed, setShowResultDelayed] = useState(false);
  const [isFightInProgress, setIsFightInProgress] = useState(false);
  const fightTimerRef = useRef(null);
  const pokemon1PreFightDataRef = useRef(null);
  const pokemon2PreFightDataRef = useRef(null);

  // --- Data Fetching --- //
  const {
    pokemon1,
    pokemon2,
    isLoading: isLoadingData,
    isError: hasLoadingError,
    errorMessage,
    arenaPokemonIds,
  } = useArenaData();

  // --- Fight Logic --- //
  const {
    performFight,
    fightResult,
    isFighting: isMutatingStats,
    resetFightResult,
  } = usePokemonFight(pokemon1, pokemon2);

  // --- Mutations --- //
  const leaveArenaMutation = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error("Użytkownik nie jest zalogowany.");
      return updateUserArena(currentUser.id, []);
    },
    onSuccess: (updatedUserData) => {
      queryClient.setQueryData(["user", currentUser?.id], updatedUserData);
      resetFightState();
      queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
    },
    onError: (error) => {
      enqueueSnackbar(`Błąd podczas opuszczania areny: ${error.message}`, {
        variant: "error",
      });
    },
  });

  const removePokemonMutation = useMutation({
    mutationFn: (pokemonIdToRemove) => {
      if (!currentUser || !pokemonIdToRemove)
        throw new Error("Brak ID użytkownika lub Pokemona.");
      const currentArenaIds =
        queryClient
          .getQueryData(["user", currentUser.id])
          ?.arenaPokemonIds?.map(String) || [];
      const updatedArena = currentArenaIds.filter(
        (id) => id !== String(pokemonIdToRemove),
      );
      return updateUserArena(currentUser.id, updatedArena);
    },
    onSuccess: (updatedUserData) => {
      queryClient.setQueryData(["user", currentUser?.id], updatedUserData);
      resetFightState();
      queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
    },
    onError: (error) => {
      enqueueSnackbar(
        `Błąd podczas usuwania Pokemona z Areny: ${error.message}`,
        { variant: "error" },
      );
    },
  });

  // --- Helper Functions --- //
  const resetFightState = useCallback(() => {
    clearTimeout(fightTimerRef.current);
    setIsFightInProgress(false);
    setShowResultDelayed(false);
    resetFightResult();
    pokemon1PreFightDataRef.current = null;
    pokemon2PreFightDataRef.current = null;
  }, [resetFightResult]);

  // --- Event Handlers --- //
  const handlePerformFight = useCallback(() => {
    if (isFightInProgress || isMutatingStats || !pokemon1 || !pokemon2) return;
    pokemon1PreFightDataRef.current = pokemon1;
    pokemon2PreFightDataRef.current = pokemon2;
    setIsFightInProgress(true);
    setShowResultDelayed(false);
    performFight();
  }, [isFightInProgress, isMutatingStats, pokemon1, pokemon2, performFight]);

  const handleLeaveArena = useCallback(() => {
    if (leaveArenaMutation.isPending || isFightInProgress || isMutatingStats)
      return;
    leaveArenaMutation.mutate();
  }, [leaveArenaMutation, isFightInProgress, isMutatingStats]);

  const handleRemovePokemon = useCallback(
    (pokemonIdToRemove) => {
      if (
        !pokemonIdToRemove ||
        removePokemonMutation.isPending ||
        isFightInProgress ||
        isMutatingStats
      )
        return;
      removePokemonMutation.mutate(pokemonIdToRemove);
    },
    [removePokemonMutation, isFightInProgress, isMutatingStats],
  );

  // --- Effects --- //
  useEffect(() => {
    if (
      !isMutatingStats &&
      fightResult &&
      isFightInProgress &&
      !showResultDelayed
    ) {
      clearTimeout(fightTimerRef.current);
      fightTimerRef.current = setTimeout(() => {
        setShowResultDelayed(true);
        setIsFightInProgress(false);
      }, FIGHT_RESULT_DELAY);
    }
    return () => clearTimeout(fightTimerRef.current);
  }, [isMutatingStats, fightResult, isFightInProgress, showResultDelayed]);

  // --- Derived State for UI --- //
  const displayFightingState = isFightInProgress && !showResultDelayed;
  const displayResultState = !!fightResult && showResultDelayed;
  const canFight = useMemo(
    () =>
      arenaPokemonIds.length === 2 &&
      !!pokemon1 &&
      !!pokemon2 &&
      !isFightInProgress &&
      !isMutatingStats &&
      !hasLoadingError &&
      !isLoadingData,
    [
      arenaPokemonIds.length,
      pokemon1,
      pokemon2,
      isFightInProgress,
      isMutatingStats,
      hasLoadingError,
      isLoadingData,
    ],
  );
  const showLeaveButton = displayResultState && !leaveArenaMutation.isPending;

  const fightResultMessage = useMemo(() => {
    if (!displayResultState) return null;
    if (!fightResult) return null; // Added null check for fightResult
    if (fightResult.draw) return "Walka zakończyła się remisem!";
    if (fightResult.winner && fightResult.loser) {
      const winnerData =
        String(pokemon1?.id) === String(fightResult.winner.id)
          ? pokemon1
          : pokemon2;
      const loserData =
        String(pokemon1?.id) === String(fightResult.loser.id)
          ? pokemon1
          : pokemon2;
      if (winnerData?.name && loserData?.name) {
        return `${capitalizeWords(winnerData.name)} pokonuje ${capitalizeWords(loserData.name)}!`;
      }
    }
    return "Walka zakończona!";
  }, [displayResultState, fightResult, pokemon1, pokemon2]);

  const dataForSlot1 = displayFightingState
    ? pokemon1PreFightDataRef.current
    : pokemon1;
  const dataForSlot2 = displayFightingState
    ? pokemon2PreFightDataRef.current
    : pokemon2;

  // --- Render --- //
  return (
    <ArenaBackground>
      <ArenaStatusDisplay
        isLoading={isLoadingData}
        errorMessage={errorMessage}
        // Removed props related to fight message
      />
      {!isLoadingData && !hasLoadingError && (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center transition-opacity duration-500 ease-in-out opacity-100">
          <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 text-shadow-lg mb-8 md:mb-12 mt-4">
            Arena Pokemon
          </h1>

          <ArenaSlotsContainer
            pokemon1Data={dataForSlot1}
            pokemon2Data={dataForSlot2}
            fightResult={fightResult}
            isFightInProgress={isFightInProgress}
            showResultDelayed={showResultDelayed}
            onRemovePokemon={handleRemovePokemon}
          />

          {/* Render the Fight Status Message here, below slots */}
          <FightStatusMessage
            displayFightingState={displayFightingState}
            fightResultMessage={fightResultMessage}
          />

          <ArenaActionButtons
            canFight={canFight}
            isFightInProgress={isFightInProgress}
            isMutatingStats={isMutatingStats}
            showLeaveButton={showLeaveButton}
            isLeavingArena={leaveArenaMutation.isPending}
            onFight={handlePerformFight}
            onLeave={handleLeaveArena}
          />
        </div>
      )}
    </ArenaBackground>
  );
};

export default ArenaPage;
