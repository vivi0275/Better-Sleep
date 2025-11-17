import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFigmaImages, useFigmaConfig } from '@/hooks/useFigma';
import { Loader2, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FigmaViewerProps {
  fileKey: string;
  nodeIds: string[];
  title?: string;
  className?: string;
}

/**
 * Composant optimisé pour afficher des designs Figma dans l'application
 * S'intègre parfaitement avec le design system existant
 */
const FigmaViewer = ({ fileKey, nodeIds, title, className }: FigmaViewerProps) => {
  const { isConfigured } = useFigmaConfig();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: images, isLoading, error } = useFigmaImages(
    fileKey || null,
    nodeIds.length > 0 ? nodeIds : undefined,
    { format: 'png', scale: 2 }
  );

  if (!isConfigured) {
    return null; // Ne rien afficher si non configuré
  }

  if (isLoading) {
    return (
      <Card className={`p-6 glass-card border-0 ${className || ''}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return (
      <Card className={`p-6 glass-card border-0 ${className || ''}`}>
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
          <p className="text-sm font-medium text-foreground mb-2">
            Impossible de charger les designs Figma
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {errorMessage}
          </p>
          <p className="text-xs text-muted-foreground">
            Vérifiez que le token Figma est bien configuré dans Settings
          </p>
        </div>
      </Card>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Card className={`p-6 glass-card border-0 ${className || ''}`}>
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            Aucun design à afficher. Vérifiez la configuration Figma.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={`p-6 glass-card border-0 hover:shadow-xl transition-shadow duration-500 ${className || ''}`}>
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-video rounded-lg overflow-hidden bg-muted border border-border cursor-pointer hover:border-primary/50 transition-all duration-300"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={`Figma design ${image.id}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Design Figma</DialogTitle>
            <DialogDescription>
              Visualisation complète du design
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full">
              <img
                src={selectedImage}
                alt="Figma design en grand"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FigmaViewer;

