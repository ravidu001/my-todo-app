import React, { useEffect } from 'react';

import axiosInstance from './utils/axiosConfig';

function App() {
  useEffect(() => {
    axiosInstance.get('/test')
      .then((res) => console.log(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">
        Todo App (Vite + MERN)
      </h1>
    </div>
  );
}

export default App;