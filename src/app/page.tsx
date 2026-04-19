import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Mirror
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Upload your Big Five personality profile and discover the four people
          who think most like you.
        </p>
      </div>
      <UploadForm />
    </main>
  );
}
