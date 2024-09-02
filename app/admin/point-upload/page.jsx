"use client";

import { getCollection, updatePoints } from "@/app/actions";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
};

const PointUpload = () => {
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, formAction] = useFormState(updatePoints, initialState);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const [teamsData, gamesData] = await Promise.all([
        getCollection("stocks", true, "name", "asc"),
        getCollection("games", true, "index", "asc"),
      ]);

      setTeams(teamsData);
      setGames(gamesData);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div className="size-full flex justify-center grow">
      {!loading && (
        <form
          className="flex flex-col gap-4 items-center justify-center w-full max-w-md"
          action={formAction}
        >
          {state.message && (
            <div
              className={`w-full p-4 border rounded-lg ${
                state.success
                  ? "border-green-700 text-green-700 bg-green-300"
                  : "border-red-700 text-red-700 bg-red-300"
              }`}
            >
              <h2>{state?.message}</h2>
            </div>
          )}
          <div className="flex flex-col gap-2.5 w-full">
            <label htmlFor="team" className="text-lg font-semibold">
              Select team:
            </label>
            <select
              name="team"
              id="team"
              className="border border-neutral-400 px-3 py-2.5 rounded-lg"
              required
            >
              {teams &&
                teams.map((team) => (
                  <option value={team.id} key={team.id} className="text-base">
                    {team.teamName}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <label htmlFor="game" className="text-lg font-semibold">
              Select game:
            </label>
            <select
              name="game"
              id="game"
              className="border border-neutral-400 px-3 py-2.5 rounded-lg"
              required
            >
              {games &&
                games.map((game) => (
                  <option value={game.id} key={game.id}>
                    {game.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <label htmlFor="points" className="text-lg font-semibold">
              Add points:
            </label>
            <input
              type="text"
              id="points"
              name="points"
              placeholder="Add points"
              className="border border-neutral-400 px-3 py-2.5 rounded-lg"
              required
            />
          </div>
          <div className="mt-10">
            <Submit />
          </div>
        </form>
      )}
    </div>
  );
};

export default PointUpload;

const Submit = () => {
  const status = useFormStatus();

  return (
    <button
      disabled={status.pending}
      type="submit"
      className="px-4 py-3 border border-neutral-400 rounded-lg"
    >
      Submit
    </button>
  );
};
