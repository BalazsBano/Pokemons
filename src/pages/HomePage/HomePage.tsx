import React, { useEffect, useState } from "react";
import { Card, Dropdown, Modal } from "react-bootstrap";
import { getPokemonTypes, getPokemonsByTypes } from "../../api";
import { IPokemon } from "../../api/getPokemonTypes/types";
import "./style.sass"

export function HomePage(){
  const [pokemonTypes, setPokemonTypes] = useState([] as IPokemon[]);
  const [pokemonsByTypes, setPokemonsByTypes] = useState([] as IPokemon[]);
  const [filteredPokemons, setFilteredPokemons] = useState([] as IPokemon[])
  const [errorMessageTypes, setErrorMessageTypes] = useState("");
  const [errorMessagePokemons, setErrorMessagePokemons] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [show, setShow] = useState(false)

  useEffect(() => {
    async function getData() {
      const pokemonTyp = await getPokemonTypes();
      if (pokemonTyp.status === 500) {
        setErrorMessageTypes(pokemonTyp.data);
        console.log(pokemonTyp.status)
      } else {
        setPokemonTypes(pokemonTyp.data)
      }
    }
    getData()
  }, []);

  async function getPokemons(url: string){
    const pokemonsByTyp = await getPokemonsByTypes(url)
    if (pokemonsByTyp.status === 500) {
      setErrorMessagePokemons(pokemonsByTyp.data);
      console.log(pokemonsByTyp.status)
    } else {
      let pokemons = []
      for (let i = 0; i < pokemonsByTyp.data.length; i++) {
        pokemons.push(pokemonsByTyp.data[i].pokemon)
      }
      console.log(pokemons)
      setPokemonsByTypes(pokemons)
      setFilteredPokemons(pokemons)
    }
  }

  async function viewPokemon(url: string){
    console.log(url)
  }

  function filteringPokemons(inputString: string){
    setSearchInput(inputString)
    if (inputString.length > 0) {
      const filtPokemons = pokemonsByTypes.filter((pokemon) => {
        return pokemon.name.match(inputString);
      })
      setFilteredPokemons(filtPokemons)
    }
  }


  return (
    <div className="h-100 mt-3 d-flex flex-column justify-content-center align-items-center">
      <div>
      {!errorMessageTypes ? (
        <Dropdown>
          <Dropdown.Toggle className="dropdown-toggle rounded-pill border-0">Choose Pokemon type</Dropdown.Toggle>
          <Dropdown.Menu>
            {pokemonTypes.map((item, index) => (
              <Dropdown.Item key={index} as="button" onClick={() => getPokemons(item.url)}>{item.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <h3>{errorMessageTypes}</h3>
      )}
      </div>

      <div>
        <input className="m-3" type="text" placeholder="Search here" onChange={(e) => {filteringPokemons(e.target.value)}} value={searchInput}/>
      </div>

      <div>
        {!errorMessagePokemons ? (
          filteredPokemons.map((item, index) => {
            return (
              <div key={index}>
                <Card className="card mb-3">
                    <Card.Body>
                      <Card.Title className="title fs-6">
                        Pokemon
                      </Card.Title>
                      <Card.Link href="#" onClick={() => viewPokemon(item.url)} className="subtitle fs-6 text-capitalize">
                        {item.name}
                      </Card.Link>
                    </Card.Body>
                  </Card>
              </div>
            )
          })
        ) : (
          <h3>{errorMessagePokemons}</h3>
        )}
      </div>

      <div>
        <Modal>

        </Modal>
      </div>
    </div>
  )
}