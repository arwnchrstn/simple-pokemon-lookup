let pokeSuggestions = [];
const getPokemonNames = async ()=>{
    try{
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1126&offset=0');
        const data = await response.json();
        console.log(data);
        const results = data.results;

        results.forEach(pokemon => {
            pokeSuggestions.push(pokemon.name);
        });
    }
    catch(e){
        console.error(e);
        alert('Error loading data: ' + e);
    }
};
//store pokemon names for suggestions
getPokemonNames();


const colorType = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};
const form = document.querySelector('#poke-search');
const searchField = document.querySelector('#search-field');
const errorPopup = document.querySelector('.error');
const errMessage = document.querySelector('#error-mes');
const result = document.querySelector('.search-result');
const pokemonImg = document.querySelector('#pokeImg');
const pokemonName = document.querySelector('#pokemon-name');
const pokemonId = document.querySelector('#poke-id');
const pokemonWeight = document.querySelector('#poke-weight');
const pokemonHeight = document.querySelector('#poke-height');
const pokeTypes = document.querySelector('#poke-type-div');
const suggestionBox = document.querySelector('.suggestion-box');

//function for fetching data
const getPokemon = async (pokename) => {
    try{
        document.querySelector('.search-load').style.display = 'flex';
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`);
        if(response.ok && response.status === 200)
            return await response.json();
        else{
            errMessage.innerHTML = `${response.status}: Pokemon not found.`;
            errorPopup.classList.toggle('active');
            console.error(`${response.status}: Pokemon not found.`);
        }
    }
    catch(error){
        console.error(error);
        errMessage.innerHTML = `An error occurred: ${error}`;
        errorPopup.classList.toggle('active');
    }
    finally{
        document.querySelector('.search-load').style.display = 'none';
        if(errorPopup.classList.contains('active'))
            setTimeout(() => {
                errorPopup.classList.toggle('active');
                errMessage.innerHTML = '';
            }, 2500);
        searchField.value = '';
        suggestionBox.classList.remove('active');
    }
};

//remove the loader when page finish to load
window.addEventListener('load', ()=>{
    document.querySelector('.loader').parentElement.removeChild(document.querySelector('.loader'));
});

//function for loading pokemon data
const loadData = async ()=> {
    const data = await getPokemon(searchField.value.toLowerCase());
    
    //display data here
    if(data){
        try{
            //pokemon sprite
            pokemonImg.src = data.sprites.other['official-artwork'].front_default;
            //pokemon name
            pokemonName.innerText = data.name[0].toUpperCase() + data.name.substr(1);
            //pokemon type and name backgroound
            if(data.types.length === 1){
                //name bg
                let pokeType = data.types[0].type.name;
                pokemonName.style.backgroundImage = 'none';
                pokemonName.style.backgroundColor = `${colorType[pokeType]}`;

                //remove child of pokemon types
                while(pokeTypes.firstChild){
                    pokeTypes.removeChild(pokeTypes.firstChild);
                }
                //pokemon type
                const type = document.createElement('span');
                type.style.backgroundColor = `${colorType[pokeType]}`;
                type.style.display = 'inline';
                type.style.borderRadius = '5px';
                type.innerText = pokeType[0].toUpperCase()+pokeType.substr(1);
                type.style.color = 'white';
                type.style.padding = '0 10px';
                pokeTypes.appendChild(type);
            }
            else if(data.types.length === 2){
                //name bg
                let pokeType1 = data.types[0].type.name;
                let pokeType2 = data.types[1].type.name;
                pokemonName.style.backgroundColor = 'none';
                pokemonName.style.backgroundImage = `linear-gradient(to left, ${colorType[pokeType2]}, ${colorType[pokeType1]})`;

                //remove child of pokemon types
                while(pokeTypes.firstChild){
                    pokeTypes.removeChild(pokeTypes.firstChild);
                }
                //pokemon type
                const type1 = document.createElement('span');
                const type2= document.createElement('span');
                type1.style.backgroundColor = `${colorType[pokeType1]}`;
                type1.style.display = 'inline';
                type1.style.borderRadius = '5px';
                type1.style.marginRight = '5px';
                type1.innerText = pokeType1[0].toUpperCase()+pokeType1.substr(1);
                type1.style.color = 'white';
                type1.style.padding = '0 10px';
                
                type2.style.backgroundColor = `${colorType[pokeType2]}`;
                type2.style.display = 'inline';
                type2.style.borderRadius = '5px';
                type2.style.marginLeft = '5px';
                type2.innerText = pokeType2[0].toUpperCase()+pokeType2.substr(1);
                type2.style.color = 'white';
                type2.style.padding = '0 10px';
                pokeTypes.appendChild(type1);
                pokeTypes.appendChild(type2);
            }
            //pokemon id
            pokemonId.innerText = data.id;
            //pokemon height
            pokemonHeight.innerText = `${data.height/10} m`;
            //pokemon weight
            pokemonWeight.innerText = `${data.weight/10} kg`;

            //pokemon base stats
            document.querySelector('#poke-hp').innerText = data.stats[0].base_stat;
            document.querySelector('#poke-atk').innerText = data.stats[1].base_stat;
            document.querySelector('#poke-def').innerText = data.stats[2].base_stat;
            document.querySelector('#poke-spatk').innerText = data.stats[3].base_stat;
            document.querySelector('#poke-spdef').innerText = data.stats[4].base_stat;
            document.querySelector('#poke-spd').innerText = data.stats[5].base_stat;

            //toggle active class on showing result
            if(result.classList.contains('active')){
                result.classList.remove('active');
                //main div delay
                setTimeout(()=>{
                    result.classList.add('active');
                    if(pokemonImg.classList.contains('active')){
                        pokemonImg.classList.remove('active');
                        //img delay
                        setTimeout(() => {
                            pokemonImg.classList.add('active');
                        }, 1000);
                    }
                }, 200);
            }
            else
                result.classList.toggle('active');
                setTimeout(() => {
                    pokemonImg.classList.toggle('active');
                }, 1000);
        }
        catch(error){
            //log error
            console.error(error);
            errMessage.innerHTML = `An error occurred: ${error}`;
            errorPopup.classList.toggle('active');
            setTimeout(() => {
                errorPopup.classList.toggle('active');
                errMessage.innerHTML = '';
            }, 2000);
        }
    }
};

//fetch pokemon on submit
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    loadData();
});

//debounce to prevent searching in every user input
const debounce = (fn, delay = 500) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    }
};

//function for updating the suggestion box
const displaySuggestions = debounce(searchText => {
    if(searchText !== ''){
        //load suggestions
        let suggestionLists = pokeSuggestions.filter(pokemon => {
            return pokemon.toLowerCase().includes(searchText.toLowerCase());
        });
        //edit suggestions to list items
        let listItems = suggestionLists.map(pokemon => {
            return `<li>${pokemon}</li>`;
        });

        //open the suggestions
        if(!suggestionBox.classList.contains('active'))
            suggestionBox.classList.add('active');

        //load suggestions to the suggestion box
        if(listItems.length > 0)
            suggestionBox.innerHTML = listItems.join('');
        else
            suggestionBox.innerHTML = '<li>No match found.</li>';
    }
    else if(searchText === ''){
        if(suggestionBox.classList.contains('active'))
            suggestionBox.classList.remove('active');
    }
}, 250);

//show suggestions as the user type in the search field
searchField.addEventListener('input', (e)=>{
    displaySuggestions(e.target.value);
});

//add the selected list item to the search box
suggestionBox.addEventListener('click', e => {
    if(e.target.nodeName === 'LI'){
        if(e.target.innerText !== "No match found."){
            searchField.value = e.target.innerText;
            loadData();
            suggestionBox.classList.remove('active');
        }    
    }
});