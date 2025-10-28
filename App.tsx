import React, { useState, useCallback } from "react";
import { ImageResult, StyleOption, styleOptions, perspectives } from "./types";
import { generateVisuals } from "./services/geminiService";
import Loader from "./components/Loader";
import EditModal from "./components/EditModal";
import CustomSelect from "./components/CustomSelect";
import {
  Palette,
  Sparkles,
  Eye,
  Download,
  Edit3,
  Zap,
  Camera,
  Layers,
  Wand2,
} from "lucide-react";

interface ImageCardProps {
  imageResult: ImageResult;
  onImageSelect: (image: ImageResult) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  imageResult,
  onImageSelect,
}) => {
  return (
    <div
      className="group relative bg-gradient-to-br from-black/90 to-teal-900/20 border border-teal-800/50 rounded-2xl p-3 aspect-square flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/20 backdrop-blur-sm"
      onClick={() => onImageSelect(imageResult)}
    >
      <div className="flex-1 relative overflow-hidden rounded-lg">
        <img
          src={imageResult.src}
          alt={imageResult.perspective}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-teal-400" />
          <span className="text-teal-200 text-sm font-medium">
            {imageResult.perspective}
          </span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Edit3 className="w-4 h-4 text-teal-400" />
          <span className="text-teal-400 text-xs">Edit</span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [style, setStyle] = useState<StyleOption>("Realistic");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ImageResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      setError("Please enter a concept description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateVisuals(description, style, perspectives);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to generate visualizations. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [description, style]);

  const handleImageSelect = (image: ImageResult) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleUpdateImage = (
    id: string,
    newSrc: string,
    newMimeType: string
  ) => {
    setGeneratedImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, src: newSrc, mimeType: newMimeType } : img
      )
    );
    setSelectedImage((prevImage) =>
      prevImage && prevImage.id === id
        ? { ...prevImage, src: newSrc, mimeType: newMimeType }
        : prevImage
    );
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Soft Teal Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #14b8a6 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 text-teal-100 font-sans flex flex-col items-center px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight font-grotesk bg-gradient-to-r from-teal-100 to-teal-300 bg-clip-text text-transparent">
              VisuMuse
            </h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-teal-200 font-medium mb-2">
              Transform your imagination into stunning visuals
            </p>
            <p className="text-sm text-teal-400">
              Describe your concept and watch it come to life from multiple
              perspectives with AI-powered creativity
            </p>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs text-teal-500">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-1">
              <Camera className="w-4 h-4" />
              <span>Multi-Angle</span>
            </div>
            <div className="flex items-center space-x-1">
              <Layers className="w-4 h-4" />
              <span>Multiple Styles</span>
            </div>
          </div>
        </header>

        {/* Input Section */}
        <section className="w-full max-w-3xl bg-gradient-to-br from-black/90 to-teal-900/10 border border-teal-800/50 rounded-2xl p-8 space-y-8 relative backdrop-blur-sm shadow-2xl">
          {isLoading && <Loader />}

          <div className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="description-input"
                className="flex items-center space-x-2 text-teal-300 text-sm font-semibold"
              >
                <Palette className="w-4 h-4" />
                <span>Concept Description</span>
              </label>
              <textarea
                id="description-input"
                placeholder="Describe your vision... e.g., A lone astronaut discovering a glowing forest on a distant moon"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/50 border border-teal-800/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none transition-all duration-200 text-teal-100 placeholder-teal-400 font-medium"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                options={styleOptions}
                value={style}
                onChange={(value) => setStyle(value as StyleOption)}
                label="Art Style"
              />

              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-teal-300 text-sm font-semibold">
                  <Camera className="w-4 h-4" />
                  <span>Perspectives</span>
                </label>
                <div className="bg-black/50 border border-teal-800/50 rounded-xl p-3">
                  <p className="text-teal-200 text-sm font-medium">
                    {perspectives.length} unique angles will be generated
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:from-teal-800 disabled:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-white shadow-lg hover:shadow-teal-500/25 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Visualization</span>
              </>
            )}
          </button>
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-400 text-center text-sm font-medium">
                {error}
              </p>
            </div>
          )}
        </section>

        {/* Output Section */}
        {generatedImages.length > 0 && (
          <section className="w-full max-w-6xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-teal-100 flex items-center justify-center space-x-2">
                <Sparkles className="w-6 h-6" />
                <span>Your Generated Visuals</span>
              </h2>
              <p className="text-teal-400 text-sm">
                Click on any image to edit and customize it further
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedImages.map((img) => (
                <ImageCard
                  key={img.id}
                  imageResult={img}
                  onImageSelect={handleImageSelect}
                />
              ))}
            </div>
          </section>
        )}
        {generatedImages.length === 0 && !isLoading && (
          <section className="w-full max-w-6xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-teal-100 flex items-center justify-center space-x-2">
                <Eye className="w-6 h-6" />
                <span>Preview Perspectives</span>
              </h2>
              <p className="text-teal-400 text-sm">
                These are the angles that will be generated for your concept
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {perspectives.map((p, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-black/80 to-teal-900/20 border border-teal-800/50 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center opacity-60 backdrop-blur-sm hover:opacity-80 transition-opacity duration-300"
                >
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-teal-800/30 rounded-xl">
                      <Camera className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-teal-300 text-sm font-medium">{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <EditModal
          isOpen={isModalOpen}
          imageResult={selectedImage}
          onClose={handleCloseModal}
          onUpdateImage={handleUpdateImage}
        />
      </div>
    </div>
  );
};

export default App;
