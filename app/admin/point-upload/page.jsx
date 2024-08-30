import { getCollection, updatePoints } from "@/app/actions";

const PointUpload = async () => {
  const teams = await getCollection("stocks", true, "name", "asc");
  const games = await getCollection("games", true, "index", "asc");

  return (
    <div className="size-full flex justify-center grow">
      <form
        className="flex flex-col gap-4 items-center justify-center w-full max-w-md"
        action={updatePoints}
      >
        <div className="flex flex-col gap-2.5 w-full">
          <label htmlFor="team" className="text-lg font-semibold">
            Select team:
          </label>
          <select
            name="team"
            id="team"
            className="border border-neutral-400 px-3 py-2.5 rounded-lg"
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
          />
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="px-4 py-3 border border-neutral-400 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PointUpload;
