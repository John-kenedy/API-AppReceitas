import React, { useEffect, useState } from 'react';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce: espera 500ms depois do usuário parar de digitar para fazer a requisição
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        // Se campo vazio, pega as primeiras 6 receitas padrão
        setLoading(true);
        fetch('https://dummyjson.com/recipes')
          .then(res => res.json())
          .then(data => {
            setRecipes(data.recipes.slice(0, 6));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        // Busca com o termo
        setLoading(true);
        fetch(`https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchTerm)}`)
          .then(res => res.json())
          .then(data => {
            setRecipes(data.recipes.slice(0, 6)); // limita a 6 resultados
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    }, 500);

    return () => clearTimeout(delayDebounce); // limpa timeout se o termo mudar antes dos 500ms
  }, [searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="search"
        placeholder="Buscar receitas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {loading ? (
        <p>Carregando receitas...</p>
      ) : (
        <div style={styles.container}>
          {recipes.length === 0 ? (
            <p>Nenhuma receita encontrada.</p>
          ) : (
            recipes.map((recipe) => (
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
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
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
