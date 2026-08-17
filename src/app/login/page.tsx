export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-[#123C34] p-6 rounded-xl w-80">
        <h1 className="mb-4 text-lg">Login</h1>

        <input className="w-full mb-3 p-2 rounded" placeholder="DNI" />
        <input className="w-full mb-3 p-2 rounded" placeholder="Password" />

        <button className="w-full bg-accent p-2 rounded">
          Ingresar
        </button> 
      </div>
    </div>
  );
}