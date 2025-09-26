import React, { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      const baseUrl =
        searchTerm.trim() === ''
          ? `https://dummyjson.com/recipes?sortBy=${sortBy}&order=${order}`
          : `https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&order=${order}`;

      fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
          setRecipes(data.recipes.slice(0, 6));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortBy, order]);

  return (
    <div className="home-container">
      <input
        type="search"
        placeholder="🔍 Buscar receitas..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="sort-controls">
        <label>
          Ordenar por:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Nome</option>
            <option value="rating">Nota</option>
            <option value="difficulty">Dificuldade</option>
            <option value="caloriesPerServing">Calorias</option>
            <option value="mealType">Tipo</option>
          </select>
        </label>

        <label>
          Ordem:
          <select value={order} onChange={e => setOrder(e.target.value)}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Carregando receitas...</p>
      ) : (
        <div className="recipe-grid">
          {recipes.length === 0 ? (
            <p>Nenhuma receita encontrada.</p>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <h3 className="recipe-title">{recipe.name}</h3>

                <div className="recipe-info-grid">
                  <div><span>⏱️</span> Tempo prep.: {recipe.prepTimeMinutes} min</div>
                  <div><span>🍳</span> Cozimento: {recipe.cookTimeMinutes} min</div>
                  <div><span>👥</span> Porções: {recipe.servings}</div>
                  <div><span>🔥</span> Calorias: {recipe.caloriesPerServing} kcal</div>
                  <div><span>⭐</span> Nota: {recipe.rating}</div>
                  <div><span>⚙️</span> Dificuldade: {recipe.difficulty}</div>
                  <div><span>🍽️</span> Tipo: {recipe.mealType[0]}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
