import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Phone,
  Car,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Trash2,
  Download,
  Paperclip,
  Save,
  X,
  Image as ImageIcon,
  File
} from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_brand: string;
  glass_type: string;
  location: string;
  status: string;
  attachments?: string[];
  notes?: string;
  registration_plate?: string;
}

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated: (lead: Lead) => void;
}

const statusOptions = [
  { value: 'new', label: 'Nouveau', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacté', color: 'bg-yellow-500' },
  { value: 'in_progress', label: 'En cours', color: 'bg-orange-500' },
  { value: 'completed', label: 'Terminé', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-500' },
];

const LeadDetailDialog = ({ lead, open, onOpenChange, onLeadUpdated }: LeadDetailDialogProps) => {
  const [notes, setNotes] = useState(lead?.notes || '');
  const [attachments, setAttachments] = useState<string[]>(lead?.attachments || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '');
      setAttachments(lead.attachments || []);
    }
  }, [lead]);

  // Generate signed URLs for attachments (bucket is private)
  React.useEffect(() => {
    const generateSignedUrls = async () => {
      if (attachments.length === 0) {
        setSignedUrls({});
        return;
      }
      
      const urls: Record<string, string> = {};
      for (const filePath of attachments) {
        try {
          // Extract just the path if it's a full URL
          let cleanPath = filePath;
          if (filePath.includes('/lead-attachments/')) {
            cleanPath = filePath.split('/lead-attachments/').pop() || filePath;
          }
          
          const { data, error } = await supabase.storage
            .from('lead-attachments')
            .createSignedUrl(cleanPath, 3600); // 1 hour expiry
          
          if (data && !error) {
            urls[filePath] = data.signedUrl;
          } else {
            console.error('Error generating signed URL for:', cleanPath, error);
          }
        } catch (err) {
          console.error('Exception generating signed URL:', err);
        }
      }
      setSignedUrls(urls);
    };
    
    generateSignedUrls();
  }, [attachments]);

  if (!lead) return null;

  const statusConfig = statusOptions.find(s => s.value === lead.status);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newAttachments: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${lead.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-attachments')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        newAttachments.push(fileName);
      }

      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);

      // Save to database
      const { error } = await supabase
        .from('leads')
        .update({ attachments: updatedAttachments })
        .eq('id', lead.id);

      if (error) throw error;

      onLeadUpdated({ ...lead, attachments: updatedAttachments });

      toast({
        title: 'Fichiers uploadés',
        description: `${newAttachments.length} fichier(s) ajouté(s)`,
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'uploader les fichiers',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAttachment = async (filePath: string) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('lead-attachments')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const updatedAttachments = attachments.filter(a => a !== filePath);
      setAttachments(updatedAttachments);

      const { error } = await supabase
        .from('leads')
        .update({ attachments: updatedAttachments })
        .eq('id', lead.id);

      if (error) throw error;

      onLeadUpdated({ ...lead, attachments: updatedAttachments });

      toast({
        title: 'Fichier supprimé',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le fichier',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadAttachment = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lead-attachments')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le fichier',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', lead.id);

      if (error) throw error;

      onLeadUpdated({ ...lead, notes });

      toast({
        title: 'Notes sauvegardées',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les notes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || filePath;
  };

  const isImage = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  const getImageUrl = (filePath: string) => {
    return signedUrls[filePath] || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            Détails de l'intervention
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut:</span>
            <Badge className={`${statusConfig?.color || 'bg-gray-500'} text-white`}>
              {statusConfig?.label || lead.status}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p className="font-medium">{lead.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a href={`mailto:${lead.email}`} className="font-medium text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <a href={`tel:${lead.phone}`} className="font-medium text-primary hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Date de demande</p>
                  <p className="font-medium">
                    {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Informations véhicule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Marque</p>
                  <p className="font-medium">{lead.vehicle_brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Type de véhicule</p>
                  <p className="font-medium">{lead.vehicle_type}</p>
                </div>
              </div>
              {lead.registration_plate && (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Immatriculation</p>
                    <p className="font-medium font-mono bg-primary/10 px-2 py-0.5 rounded inline-block">{lead.registration_plate}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Type de vitrage</p>
                  <p className="font-medium">{lead.glass_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Localisation</p>
                  <p className="font-medium">{lead.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Pièces jointes ({attachments.length})
              </h3>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Upload...' : 'Ajouter'}
                </Button>
              </div>
            </div>
            
            {attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune pièce jointe
              </p>
            ) : (
              <div className="space-y-3">
                {/* Image thumbnails grid */}
                {attachments.filter(isImage).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {attachments.filter(isImage).map((filePath, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={getImageUrl(filePath)} 
                          alt={getFileName(filePath)}
                          className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(getImageUrl(filePath), '_blank')}
                        />
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-6 w-6 bg-white/90"
                            onClick={() => handleDownloadAttachment(filePath)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-6 w-6 bg-white/90 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAttachment(filePath)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Other files list */}
                {attachments.filter(f => !isImage(f)).map((filePath, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-background rounded-md p-2 border"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(filePath)}
                      <span className="text-sm truncate">{getFileName(filePath)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleDownloadAttachment(filePath)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAttachment(filePath)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes internes
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes internes sur cette intervention..."
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;