import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Modal } from "react-bootstrap";
import { getPokemonTypes, getPokemonsByTypes, getSelectedPokemonsData } from "../../api";
import { ISelectedPokemon } from "../../api/configuration";
import { IPokemon } from "../../api/getPokemonTypes/types";
import "./style.sass"

export function HomePage(){
  const [pokemonTypes, setPokemonTypes] = useState([] as IPokemon[]);
  const [pokemonsByTypes, setPokemonsByTypes] = useState([] as IPokemon[]);
  const [filteredPokemons, setFilteredPokemons] = useState([] as IPokemon[]);
  const [selectedPokemon, setSelectedPokemon] = useState({} as ISelectedPokemon);
  const [errorMessageTypes, setErrorMessageTypes] = useState("");
  const [errorMessagePokemons, setErrorMessagePokemons] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
	const modalShow = () => setShow(true);

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
        pokemons.push({...pokemonsByTyp.data[i].pokemon, catch: false})
      }
      console.log(pokemons)
      setPokemonsByTypes(pokemons)
      setFilteredPokemons(pokemons)
    }
  }

  async function viewPokemon(url: string, name: string){
    const catched = filteredPokemons.filter((pokemon) => {
      return pokemon.name.match(name)
    })[0].catch
    
    const pokemonData = await getSelectedPokemonsData(url)
    if (pokemonData.status === 500) {
      setErrorMessagePokemons(pokemonData.data);
      console.log(pokemonData.status)
    } else {
      let abilities = [];
      for (let i = 0; i < pokemonData.data.abilities.length; i++) {
        if (pokemonData.data.abilities[i].is_hidden === false) {
          abilities.push(pokemonData.data.abilities[i].ability.name)
        }
      }
      
      const selectedPokemonData = {
        "name": name,
        "image": pokemonData.data.sprites.other.home.front_default,
        "weight": pokemonData.data.weight,
        "height": pokemonData.data.height,
        "abilities": abilities.join(", ")
      }
      setSelectedPokemon(selectedPokemonData)
      console.log(selectedPokemonData)
      setShow(true)
    }

    
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

  function catchingPokemon(name: string){
    console.log(name)
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

      <div className="d-lg-flex flex-column row g-3 m-5">
        {!errorMessagePokemons ? (
          filteredPokemons.map((item, index) => {
            return (
              <div key={index} className="col-md-12">
                <Card className="card mb-3">
                  <Card.Body className="">
                    <Card.Title className="title fs-6">
                      Pokemon
                    </Card.Title>
                    <Card.Link href="#" onClick={() => viewPokemon(item.url, item.name)} className="subtitle fs-6 text-capitalize">
                      {item.name}
                    </Card.Link>
                    <Card.Link>
                      Link: {item.catch.toString()}
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
        <Modal show={show} onHide={modalClose} >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPokemon.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedPokemon.image} />
            <p>Weight: {selectedPokemon.weight}</p>
            <p>Height: {selectedPokemon.height}</p>
            <p>Not hidden abilities: {selectedPokemon.abilities}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" onClick={() => catchingPokemon(selectedPokemon.name)}>Catch</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}