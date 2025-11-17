import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useFigmaFile, useFigmaImages, useFigmaConfig } from '@/hooks/useFigma';
import { Loader2, Image as ImageIcon, AlertCircle, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FigmaDesignProps {
  fileKey?: string;
  nodeIds?: string[];
  title?: string;
  showConfig?: boolean;
}

const FigmaDesign = ({ fileKey, nodeIds = [], title, showConfig = true }: FigmaDesignProps) => {
  const [localFileKey, setLocalFileKey] = useState<string>(fileKey || '');
  const [localNodeIds, setLocalNodeIds] = useState<string[]>(nodeIds);
  const [nodeIdInput, setNodeIdInput] = useState('');
  const [fileKeyInput, setFileKeyInput] = useState('');
  const { isConfigured, setToken } = useFigmaConfig();
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenDialog, setShowTokenDialog] = useState(false);

  const { data: fileData, isLoading: fileLoading, error: fileError } = useFigmaFile(
    localFileKey || null,
    { enabled: isConfigured && !!localFileKey }
  );

  const { data: images, isLoading: imagesLoading, error: imagesError } = useFigmaImages(
    localFileKey || null,
    localNodeIds.length > 0 ? localNodeIds : undefined,
    { format: 'png', scale: 2 }
  );

  const handleSetFileKey = () => {
    if (fileKeyInput.trim()) {
      setLocalFileKey(fileKeyInput.trim());
      setFileKeyInput('');
    }
  };

  const handleAddNodeId = () => {
    if (nodeIdInput.trim() && !localNodeIds.includes(nodeIdInput.trim())) {
      setLocalNodeIds([...localNodeIds, nodeIdInput.trim()]);
      setNodeIdInput('');
    }
  };

  const handleRemoveNodeId = (id: string) => {
    setLocalNodeIds(localNodeIds.filter((nodeId) => nodeId !== id));
  };

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      setShowTokenDialog(false);
      setTokenInput('');
    }
  };

  if (!isConfigured) {
    return (
      <Card className="p-6 glass-card border-0">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Configuration Figma requise</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pour afficher les designs Figma, vous devez configurer votre token d'accès.
            </p>
            <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
              <DialogTrigger asChild>
                <Button>Configurer le token</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configuration du token Figma</DialogTitle>
                  <DialogDescription>
                    Entrez votre token d'accès Figma. Vous pouvez le générer depuis{' '}
                    <a
                      href="https://www.figma.com/developers/api#access-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      les paramètres de votre compte Figma
                    </a>
                    .
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Votre token Figma"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSetToken()}
                  />
                  <Button onClick={handleSetToken} className="w-full">
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card border-0">
      {(fileLoading || imagesLoading) && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {(fileError || imagesError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileError instanceof Error
              ? fileError.message
              : imagesError instanceof Error
              ? imagesError.message
              : 'Une erreur est survenue lors du chargement des données Figma'}
          </AlertDescription>
        </Alert>
      )}

      {fileData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {title || fileData.name}
              </h3>
              {fileData.last_modified && (
                <p className="text-xs text-muted-foreground">
                  Modifié le {new Date(fileData.last_modified).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            {showConfig && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configuration Figma</DialogTitle>
                      <DialogDescription>
                        Configurez votre fichier Figma et les nœuds à afficher.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {!localFileKey && (
                        <div className="space-y-2">
                          <Label htmlFor="file-key">Clé du fichier Figma</Label>
                          <div className="flex gap-2">
                            <Input
                              id="file-key"
                              placeholder="Ex: abc123def456"
                              value={fileKeyInput}
                              onChange={(e) => setFileKeyInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSetFileKey()}
                            />
                            <Button onClick={handleSetFileKey}>Charger</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            La clé du fichier se trouve dans l'URL Figma : figma.com/file/[FILE_KEY]/...
                          </p>
                        </div>
                      )}
                      {localFileKey && (
                        <div className="space-y-2">
                          <Label>Fichier configuré</Label>
                          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md text-sm">
                            <span>{localFileKey}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-auto"
                              onClick={() => {
                                setLocalFileKey('');
                                setLocalNodeIds([]);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      )}
                      {localFileKey && (
                        <div className="space-y-2">
                          <Label htmlFor="node-id">ID du nœud</Label>
                          <div className="flex gap-2">
                            <Input
                              id="node-id"
                              placeholder="Ex: 1:23 ou 1:24"
                              value={nodeIdInput}
                              onChange={(e) => setNodeIdInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddNodeId()}
                            />
                            <Button onClick={handleAddNodeId}>Ajouter</Button>
                          </div>
                          {localNodeIds.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <p className="text-sm font-medium">Nœuds configurés:</p>
                              <div className="flex flex-wrap gap-2">
                                {localNodeIds.map((id) => (
                                  <div
                                    key={id}
                                    className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md text-sm"
                                  >
                                    <span>{id}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => handleRemoveNodeId(id)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
              </Dialog>
            )}
          </div>

          {images && images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="relative group cursor-pointer"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all duration-300">
                    <img
                      src={image.url}
                      alt={`Figma node ${image.id}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Node ID: {image.id}
                  </div>
                </div>
              ))}
            </div>
          ) : localNodeIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Aucun nœud configuré. Ajoutez des IDs de nœuds pour afficher les designs.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default FigmaDesign;

