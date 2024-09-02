"use client";

import { getCollection, updateBalance } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

const MoneyUpload = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, formAction] = useFormState(updateBalance, initialState);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const mentorsData = await getCollection("users");

      setMentors(mentorsData);
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
            <label htmlFor="mentor" className="text-lg font-semibold">
              Select mentor:
            </label>
            <select
              name="mentor"
              id="mentor"
              className="border border-neutral-400 px-3 py-2.5 rounded-lg"
              required
            >
              {mentors &&
                mentors.map((mentor) => (
                  <option
                    value={mentor.id}
                    key={mentor.id}
                    className="text-base"
                  >
                    {mentor.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <label htmlFor="amount" className="text-lg font-semibold">
              Amount:
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              placeholder="Add amount"
              className="border border-neutral-400 px-3 py-2.5 rounded-lg"
              required
            />
          </div>
          <div className="mt-10">
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  );
};

export default MoneyUpload;
