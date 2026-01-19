import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Search, 
  Download, 
  RefreshCw, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Car,
  MapPin,
  Filter,
  BarChart3,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import topglassLogo from '@/assets/topglass-logo-transparent.png';

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
}

const statusOptions = [
  { value: 'new', label: 'Nouveau', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacté', color: 'bg-yellow-500' },
  { value: 'in_progress', label: 'En cours', color: 'bg-orange-500' },
  { value: 'completed', label: 'Terminé', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-500' },
];

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchLeads();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, dateFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les leads",
        variant: "destructive",
      });
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term) ||
        lead.vehicle_brand.toLowerCase().includes(term) ||
        lead.location.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(lead => new Date(lead.created_at) >= filterDate);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } else {
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast({
        title: "Succès",
        description: "Statut mis à jour",
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'intervention",
        variant: "destructive",
      });
    } else {
      setLeads(leads.filter(lead => lead.id !== leadId));
      toast({
        title: "Succès",
        description: "Intervention supprimée",
      });
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Nom', 'Email', 'Téléphone', 'Type véhicule', 'Marque', 'Type vitrage', 'Localisation', 'Statut'];
    const csvContent = [
      headers.join(';'),
      ...filteredLeads.map(lead => [
        new Date(lead.created_at).toLocaleDateString('fr-FR'),
        lead.name,
        lead.email,
        lead.phone,
        lead.vehicle_type,
        lead.vehicle_brand,
        lead.glass_type,
        lead.location,
        statusOptions.find(s => s.value === lead.status)?.label || lead.status
      ].join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_topglass_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: "Export réussi",
      description: `${filteredLeads.length} leads exportés`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    inProgress: leads.filter(l => l.status === 'in_progress' || l.status === 'contacted').length,
    completed: leads.filter(l => l.status === 'completed').length,
    thisWeek: leads.filter(l => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(l.created_at) >= weekAgo;
    }).length,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={`${statusConfig?.color || 'bg-gray-500'} text-white`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas les droits d'administrateur pour accéder à cette page.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header */}
      <header className="bg-[#1a1a2e]/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={topglassLogo} alt="TopGlass" className="h-10" />
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg">Dashboard Admin</h1>
                <p className="text-white/60 text-sm">Gestion des leads</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm hidden md:block">{user?.email}</span>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/10 border-white/10 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-10 w-10 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Nouveaux</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.new}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-400 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">En cours</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.inProgress}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-400 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Terminés</p>
                  <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-400 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="bg-white/10 border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone, marque..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">7 jours</SelectItem>
                    <SelectItem value="month">30 jours</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={fetchLeads} 
                  variant="outline" 
                  size="icon"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>

                <Button 
                  onClick={exportCSV}
                  className="gradient-cta text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="bg-white/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leads ({filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun lead trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/70">Date</TableHead>
                      <TableHead className="text-white/70">Contact</TableHead>
                      <TableHead className="text-white/70">Véhicule</TableHead>
                      <TableHead className="text-white/70">Vitrage</TableHead>
                      <TableHead className="text-white/70">Localisation</TableHead>
                      <TableHead className="text-white/70">Statut</TableHead>
                      <TableHead className="text-white/70 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white/80">
                          <div className="text-sm">
                            {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-white/50">
                            {new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="font-medium">{lead.name}</div>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4 text-primary" />
                            {lead.vehicle_brand}
                          </div>
                          <div className="text-xs text-white/50">{lead.vehicle_type}</div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {lead.glass_type}
                        </TableCell>
                        <TableCell className="text-white/80">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            {lead.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={lead.status || 'new'} 
                            onValueChange={(value) => updateLeadStatus(lead.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs bg-transparent border-white/20">
                              {getStatusBadge(lead.status || 'new')}
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  <Badge className={`${status.color} text-white`}>
                                    {status.label}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette intervention ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. L'intervention de {lead.name} sera définitivement supprimée de la base de données.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteLead(lead.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
