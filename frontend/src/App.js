import React from "react";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="p-4 bg-green-500 w-full text-white text-center">
        <h1 className="text-2xl">Corn Disease Diagnosis System</h1>
      </header>
      <main className="p-4">
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
