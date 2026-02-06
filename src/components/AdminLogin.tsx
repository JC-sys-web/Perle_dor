import { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<boolean>;
}

export function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await onLogin(password);
      if (ok) {
        setPassword('');
        setError('');
      } else {
        setError('Mot de passe incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-heading text-2xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            Administration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Mot de passe administrateur
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Entrez le mot de passe"
                className="pr-10 bg-cream border-border focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-gold-light text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Mot de passe par défaut : admin123
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
