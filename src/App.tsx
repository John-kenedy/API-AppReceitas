import React, { useEffect, useState } from 'react';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // padrão 'name' (nome)
  const [order, setOrder] = useState('asc'); // padrão crescente

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      
      // Define base da URL com sortBy e order
      const baseUrl = searchTerm.trim() === ''
        ? `https://dummyjson.com/recipes?sortBy=${sortBy}&order=${order}`
        : `https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&order=${order}`;

      fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
          setRecipes(data.recipes.slice(0, 6)); // pega os 6 primeiros
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortBy, order]); // depende dos 3 estados

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="search"
        placeholder="Buscar receitas..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.sortContainer}>
        <label>
          Ordenar por:{' '}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
            <option value="name">Nome</option>
            <option value="rating">Nota</option>
            <option value="difficulty">Dificuldade</option>
            <option value="caloriesPerServing">Calorias</option>
            <option value="mealType">Tipo</option>
          </select>
        </label>

        <label style={{ marginLeft: '15px' }}>
          Ordem:{' '}
          <select value={order} onChange={e => setOrder(e.target.value)} style={styles.select}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Carregando receitas...</p>
      ) : (
        <div style={styles.container}>
          {recipes.length === 0 ? (
            <p>Nenhuma receita encontrada.</p>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} style={styles.card}>
                <img src={recipe.image} alt={recipe.name} style={styles.image} />
                <h3>{recipe.name}</h3>
                <p><strong>Tempo de preparo:</strong> {recipe.prepTimeMinutes} min</p>
                <p><strong>Tempo de cozimento:</strong> {recipe.cookTimeMinutes} min</p>
                <p><strong>Porções:</strong> {recipe.servings}</p>
                <p><strong>Calorias:</strong> {recipe.caloriesPerServing}</p>
                <p><strong>Nota:</strong> {recipe.rating}</p>
                <p><strong>Dificuldade:</strong> {recipe.difficulty}</p>
                <p><strong>Tipo:</strong> {recipe.mealType}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px 15px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  sortContainer: {
    marginBottom: '20px',
  },
  select: {
    padding: '5px 10px',
    fontSize: '14px',
    borderRadius: '5px',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '10px',
  },
};
