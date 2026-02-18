// essa primeira linha to dizendo que o codigo só roda com alpine pronto e na alpine.data estou registrando um componente e marcando o estado do componente.
document.addEventListener("alpine:init", () => {
    Alpine.data("pokemonApp", () => ({
        pokemonName: "",
        pokemons: [],
        maxPokemons: 5,
        favorites: [],
        loading: false,
        allPokemons: [],

// aqui criei uma lista filtrada 
        get filteredPokemons() {
            if (!this.pokemonName) return [];

            return this.allPokemons
                .filter(p =>
                    p.name.startsWith(this.pokemonName.toLowerCase())
                )
                .slice(0, 5); 
        },

// fiz um componente que faz requisicao p api e ela salva os dados no estado que tiver.

// fiz duas funcoes dentro do componente, ela verifica se o nome existe na lista..se existir ela chama a outra funcao que faz requisicao pra api, pega só os dados que precisa e salva tambem. tem um pequeno controle de loading e limita a quantidade de pokemons

// tentei fazer aquilo de salvar os dados depois de recarregar a pagina e
// fiz a opcao de favoritos, ele verifica se ja existe outro pra nao duplicar, quando remove vai pelo filtro e depois ele salva tudo no localstorage.

// usei o init, quando iniciar carrega a lista da api e tambem recupera os favoertiso.

        async loadPokemonList() {
            const res = await fetch(
                "https://pokeapi.co/api/v2/pokemon?limit=1000"
            );
            const data = await res.json();
            this.allPokemons = data.results;
        },

        async fetchPokemonByUrl(url) {
            this.loading = true;

            try {
                const res = await fetch(url);
                const data = await res.json();

                const newPokemon = {
                    name: data.name,
                    sprite: data.sprites.front_default,
                    type: data.types[0].type.name
                };

                this.pokemons.unshift(newPokemon);
                if (this.pokemons.length > this.maxPokemons){
                    this.pokemons.pop();
                }

            } catch (error) {
                alert("Erro ao buscar Pokémon");
            } finally {
                this.loading = false;
            }
        },

        async fetchPokemon() {
            if (!this.pokemonName) return;

            const match = this.allPokemons.find(
                p => p.name === this.pokemonName.toLowerCase()
            );

            if (match) {
                this.fetchPokemonByUrl(match.url);
            } else {
                alert("Pokémon não encontrado!");
            }
        },

        addFavorite(pokemon) {
    const exists = this.favorites.some(
        p => p.name === pokemon.name
    );

    if (exists) return;

    this.favorites.push(pokemon);
    this.saveFavorites();
},

        removeFavorite(name) {
            this.favorites = this.favorites.filter(
                p => p.name !== name
            );
            this.saveFavorites();
        },

        saveFavorites() {
            localStorage.setItem(
                "favorites",
                JSON.stringify(this.favorites)
            );
        },

        loadFavorites() {
            const saved = localStorage.getItem("favorites");
            this.favorites = saved ? JSON.parse(saved) : [];
        },


        async init() {
            await this.loadPokemonList();
            this.loadFavorites();
        }
    }));
});