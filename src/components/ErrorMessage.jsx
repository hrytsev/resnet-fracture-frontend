export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg" role="alert">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}
