import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { getPokemonTypes, getPokemonsByTypes } from "../../api";
import { IPokemon } from "../../api/getPokemonTypes/types";
import "./style.sass"

export function HomePage(){
  const [pokemonTypes, setPokemonTypes] = useState([] as IPokemon[]);
  const [pokemonsByTypes, setPokemonsByTypes] = useState([] as IPokemon[]);
  const [errorMessageTypes, setErrorMessageTypes] = useState("");
  const [errorMessagePokemons, setErrorMessagePokemons] = useState("");
  const [searchInput, setSearchInput] = useState("");

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

  let dropdownStyle = {
    background: '#2daaa5'
  }

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
    }
  }


  return (
    <div className="h-100 mt-3 d-flex flex-column justify-content-center align-items-center">
      <div>
      {!errorMessageTypes ? (
        <Dropdown>
          <Dropdown.Toggle style={dropdownStyle} className="dropdown-toggle rounded-pill border-0">Choose Pokemon type</Dropdown.Toggle>
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
        <input className="m-3" type="text" placeholder="Search here" onChange={(e) => {setSearchInput(e.target.value); console.log(searchInput)}} value={searchInput}/>
      </div>

      <div>
        {!errorMessagePokemons ? (
          pokemonsByTypes.map((item, index) => {
            return (
              <div key={index}>
                <Card className="card mb-3">
                    <Card.Body>
                      <Card.Title className="title fs-6">
                        name: {item.name}
                      </Card.Title>
                      <Card.Link href={item.url} target="blank" className="subtitle fs-6 text-capitalize">
                        {item.url}
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
    </div>
  )
}