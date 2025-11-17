import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFigmaConfig } from '@/hooks/useFigma';
import FigmaViewer from './FigmaViewer';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FigmaIntegrationProps {
  defaultFileKey?: string;
  defaultNodeIds?: string[];
  title?: string;
  onDesignsLoaded?: (fileKey: string, nodeIds: string[]) => void;
}

/**
 * Composant complet pour intégrer des designs Figma dans l'application
 * S'intègre parfaitement avec le design system existant
 */
const FigmaIntegration = ({
  defaultFileKey = '',
  defaultNodeIds = [],
  title = 'Designs Figma',
  onDesignsLoaded,
}: FigmaIntegrationProps) => {
  const { isConfigured, setToken, clearToken } = useFigmaConfig();
  const [fileKey, setFileKey] = useState(defaultFileKey);
  const [nodeIds, setNodeIds] = useState<string[]>(defaultNodeIds);
  const [nodeIdInput, setNodeIdInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      setShowConfig(false);
      setTokenInput('');
    }
  };

  const handleAddNodeId = () => {
    if (nodeIdInput.trim() && !nodeIds.includes(nodeIdInput.trim())) {
      const newNodeIds = [...nodeIds, nodeIdInput.trim()];
      setNodeIds(newNodeIds);
      setNodeIdInput('');
      if (onDesignsLoaded && fileKey) {
        onDesignsLoaded(fileKey, newNodeIds);
      }
    }
  };

  const handleSetFileKey = () => {
    const newFileKey = fileKey || '';
    if (newFileKey.trim() && newFileKey !== fileKey) {
      setFileKey(newFileKey.trim());
      if (onDesignsLoaded && nodeIds.length > 0) {
        onDesignsLoaded(newFileKey.trim(), nodeIds);
      }
    }
  };

  if (!isConfigured) {
    return (
      <Card className="p-6 glass-card border-0">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Configuration Figma requise</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configurez votre token d'accès Figma pour afficher les designs.
            </p>
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
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
                  <div className="space-y-2">
                    <Label htmlFor="token">Token d'accès Figma</Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="Votre token Figma"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSetToken()}
                    />
                  </div>
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
    <div className="space-y-4">
      {/* Configuration rapide */}
      <Card className="p-4 glass-card border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">Figma configuré</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuration Figma</DialogTitle>
                <DialogDescription>
                  Configurez votre fichier Figma et les nœuds à afficher.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-key">Clé du fichier Figma</Label>
                  <div className="flex gap-2">
                    <Input
                      id="file-key"
                      placeholder="Ex: abc123def456"
                      value={fileKey}
                      onChange={(e) => setFileKey(e.target.value)}
                    />
                    <Button onClick={handleSetFileKey}>Charger</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La clé se trouve dans l'URL : figma.com/file/[FILE_KEY]/...
                  </p>
                </div>

                {fileKey && (
                  <div className="space-y-2">
                    <Label htmlFor="node-id">ID du nœud</Label>
                    <div className="flex gap-2">
                      <Input
                        id="node-id"
                        placeholder="Ex: 1:23"
                        value={nodeIdInput}
                        onChange={(e) => setNodeIdInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNodeId()}
                      />
                      <Button onClick={handleAddNodeId}>Ajouter</Button>
                    </div>
                    {nodeIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {nodeIds.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md text-sm"
                          >
                            <span>{id}</span>
                            <button
                              onClick={() => setNodeIds(nodeIds.filter((n) => n !== id))}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={clearToken}
                    className="w-full text-destructive"
                  >
                    Déconnecter Figma
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Affichage des designs */}
      {fileKey && nodeIds.length > 0 && (
        <FigmaViewer fileKey={fileKey} nodeIds={nodeIds} title={title} />
      )}
    </div>
  );
};

export default FigmaIntegration;

