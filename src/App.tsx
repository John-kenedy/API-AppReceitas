import React, { useEffect, useState } from 'react';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/recipes')
      .then(res => res.json())
      .then(data => {
        // Pega só os primeiros 6
        setRecipes(data.recipes.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar receitas:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando receitas...</p>;

  return (
    <div style={styles.container}>
      {recipes.map((recipe) => (
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
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '20px',
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
