"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentUploadProps {
  userId: string;
  role: string;
  currentDocuments: any[];
  onUploadComplete: (newDocs: any[]) => void;
}

export function DocumentUpload({ userId, role, currentDocuments = [], onUploadComplete }: DocumentUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError(null);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Update Database
      const newDoc = {
        name: file.name,
        path: filePath,
        uploaded_at: new Date().toISOString(),
        type: role === 'sme' ? 'Business Registration' : role === 'logistics' ? 'CAC/License' : 'ID Card'
      };

      const updatedDocs = [...(currentDocuments || []), newDoc];
      
      let table = 'sme_profiles';
      if (role === 'logistics') table = 'logistics_profiles';
      if (role === 'rider') table = 'rider_profiles';

      const { error: dbError } = await supabase
        .from(table)
        .update({ 
          documents: updatedDocs,
          verification_status: 'pending' // Auto-submit for verification on upload
        })
        .eq('id', userId);

      if (dbError) throw dbError;

      onUploadComplete(updatedDocs);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="doc-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors border border-input">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span className="text-sm font-medium">Upload Document</span>
          </div>
          <input 
            id="doc-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </Label>
        <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {currentDocuments && currentDocuments.length > 0 && (
        <div className="grid gap-2">
          {currentDocuments.map((doc: any, i: number) => (
            <Card key={i} className="bg-muted/50 border-none shadow-none">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
