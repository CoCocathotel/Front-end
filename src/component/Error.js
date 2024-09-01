// create dialog error

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="justify-center flex">
          <h1 className="text-4xl">404</h1>
        </div>
        <div className="m-5 flex">
          <h2 className="text-2xl">Page not found</h2>
        </div>
      </div>
    </div>
  );
}
