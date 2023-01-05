import axios from "axios";
import { IPokemon } from "../getPokemonTypes/types";

const url: string = process.env.REACT_APP_API_TYPES_URL || "";

export async function getPokemonsByTypes(url: string) {
  try {
    const data = await axios.get(url)
    if (typeof data.data !== "object") {
      return { data: "Intentional error", status: 500 };
    } else {
      return { data: data.data.pokemon, status: data.status };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return { data: error.message, status: 500 };
    } else {
      console.log("unexpected error: ", error);
      return { data: "An unexpected error occured", status: 500 };
    }
  }
}
