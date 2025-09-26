import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [limit] = useState(6); // quantos itens por página
  const [skip, setSkip] = useState(0); // quantos itens pular (página atual * limit)
  const [total, setTotal] = useState(0); // total de receitas retornadas da API

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setLoading(true);

      const baseUrl =
        searchTerm.trim() === ''
          ? `https://dummyjson.com/recipes?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`
          : `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
              searchTerm
            )}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;

      fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
          setRecipes(data.recipes);
          setTotal(data.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortBy, order, skip, limit]);

  // Funções para navegar entre páginas
  const handleNext = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  const handlePrev = () => {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  };

  return (
    <div className="home-container">
      <input
        type="search"
        placeholder="🔍 Buscar receitas..."
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setSkip(0); // resetar paginação ao mudar busca
        }}
        className="search-input"
      />

      <div className="sort-controls">
        <label>
          Ordenar por:
          <select
            value={sortBy}
            onChange={e => {
              setSortBy(e.target.value);
              setSkip(0);
            }}
          >
            <option value="name">Nome</option>
            <option value="rating">Nota</option>
            <option value="difficulty">Dificuldade</option>
            <option value="caloriesPerServing">Calorias</option>
            <option value="mealType">Tipo</option>
          </select>
        </label>

        <label>
          Ordem:
          <select
            value={order}
            onChange={e => {
              setOrder(e.target.value);
              setSkip(0);
            }}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Carregando receitas...</p>
      ) : (
        <>
          <div className="recipe-grid">
            {recipes.length === 0 ? (
              <p>Nenhuma receita encontrada.</p>
            ) : (
              recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="recipe-image"
                  />
                  <h3 className="recipe-title">{recipe.name}</h3>

                  <div className="recipe-info-grid">
                    <div>
                      <span>⏱️</span> Tempo prep.: {recipe.prepTimeMinutes} min
                    </div>
                    <div>
                      <span>🍳</span> Cozimento: {recipe.cookTimeMinutes} min
                    </div>
                    <div>
                      <span>👥</span> Porções: {recipe.servings}
                    </div>
                    <div>
                      <span>🔥</span> Calorias: {recipe.caloriesPerServing} kcal
                    </div>
                    <div>
                      <span>⭐</span> Nota: {recipe.rating}
                    </div>
                    <div>
                      <span>⚙️</span> Dificuldade: {recipe.difficulty}
                    </div>
                    <div>
                      <span>🍽️</span> Tipo: {recipe.mealType[0]}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={skip === 0}>
              Anterior
            </button>
            <button onClick={handleNext} disabled={skip + limit >= total}>
              Próximo
            </button>
            <p>
              Página {Math.floor(skip / limit) + 1} de{' '}
              {Math.ceil(total / limit)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
