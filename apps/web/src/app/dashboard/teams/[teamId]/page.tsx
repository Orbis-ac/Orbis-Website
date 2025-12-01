'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '@iconify-icon/react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/useSessionStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
  };
}

interface Team {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  websiteUrl?: string;
  discordUrl?: string;
  logo?: string;
  banner?: string;
  members: TeamMember[];
  _count?: {
    members: number;
    resources: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TeamManagePage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useSessionStore();
  const teamName = params.teamId as string;

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    websiteUrl: '',
    discordUrl: '',
  });

  const [newMember, setNewMember] = useState({
    userId: '',
    role: 'MEMBER' as 'OWNER' | 'ADMIN' | 'MEMBER',
  });

  const userRole = team?.members?.find(m => m.user.id === session?.user?.id)?.role;
  const canEdit = userRole === 'OWNER' || userRole === 'ADMIN';
  const isOwner = userRole === 'OWNER';

  useEffect(() => {
    fetchTeam();
  }, [teamName]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      // Utiliser le name pour récupérer la team (l'endpoint retourne l'ID)
      const response = await fetch(`${API_URL}/teams/${teamName}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }

      const data = await response.json();
      setTeam(data);
      setFormData({
        displayName: data.displayName,
        description: data.description || '',
        websiteUrl: data.websiteUrl || '',
        discordUrl: data.discordUrl || '',
      });
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team?.id) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }

      const updatedTeam = await response.json();
      setTeam(updatedTeam);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!team?.id) return;

    try {
      const formData = new FormData();
      formData.append(type, file);

      const response = await fetch(`${API_URL}/teams/${team.id}/${type}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${type}`);
      }

      await fetchTeam();
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  };

  const handleDeleteFile = async (type: 'logo' | 'banner') => {
    if (!team?.id) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}/${type}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      await fetchTeam();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team?.id) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      await fetchTeam();
      setShowAddMember(false);
      setNewMember({ userId: '', role: 'MEMBER' });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') => {
    if (!team?.id) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update member role');
      }

      await fetchTeam();
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!team?.id) return;
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      await fetchTeam();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleLeaveTeam = async () => {
    if (!team?.id) return;
    if (!confirm('Are you sure you want to leave this team?')) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}/leave`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to leave team');
      }

      router.push('/dashboard/teams');
    } catch (error) {
      console.error('Error leaving team:', error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team?.id) return;
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/teams/${team.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      router.push('/dashboard/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-12">
          <Icon icon="mdi:loading" className="animate-spin" width="48" height="48" />
        </div>
    );
  }

  if (!team) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="mdi:account-group-outline" width="48" height="48" className="text-muted-foreground" />
          <p className="text-foreground font-nunito text-lg mt-4">Team not found</p>
          <Button onClick={() => router.push('/dashboard/teams')} className="mt-4 font-hebden">
            Back to Teams
          </Button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
                onClick={() => router.push('/dashboard/teams')}
                className="font-hebden"
                variant="ghost"
                size="icon"
            >
              <Icon icon="mdi:arrow-left" width="20" height="20" />
            </Button>
            <h1 className="text-3xl font-bold font-hebden text-foreground">Team Management</h1>
          </div>
          {!isOwner && (
              <Button onClick={handleLeaveTeam} variant="destructive" className="font-hebden">
                <Icon icon="mdi:exit-to-app" width="20" height="20" />
                Leave Team
              </Button>
          )}
        </div>

        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
          {team.banner && (
              <Image
                  src={team.banner}
                  alt={`${team.displayName} banner`}
                  fill
                  className="object-cover"
              />
          )}
          {canEdit && (
              <div className="absolute top-4 right-4 flex gap-2">
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'banner')}
                />
                <Button
                    size="icon-sm"
                    className="font-hebden"
                    onClick={() => bannerInputRef.current?.click()}
                >
                  <Icon icon="mdi:upload" width="16" height="16" />
                </Button>
                {team.banner && (
                    <Button
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => handleDeleteFile('banner')}
                        className="font-hebden"
                    >
                      <Icon icon="mdi:delete" width="16" height="16" />
                    </Button>
                )}
              </div>
          )}
        </div>

        {/* Team Info */}
        <div className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="relative">
              {team.logo ? (
                  <Image
                      src={team.logo}
                      alt={team.displayName}
                      width={96}
                      height={96}
                      className="rounded-lg"
                  />
              ) : (
                  <div className="w-24 h-24 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon icon="mdi:account-group" width="48" height="48" />
                  </div>
              )}
              {canEdit && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                    />
                    <Button
                        size="icon-sm"
                        className="font-hebden"
                        onClick={() => logoInputRef.current?.click()}
                    >
                      <Icon icon="mdi:upload" width="16" height="16" />
                    </Button>
                    {team.logo && (
                        <Button
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile('logo')}
                            className="font-hebden"
                        >
                          <Icon icon="mdi:delete" width="16" height="16" />
                        </Button>
                    )}
                  </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              {!isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold font-hebden text-foreground">{team.displayName}</h2>
                        <p className="text-muted-foreground font-nunito">@{team.name}</p>
                      </div>
                      {canEdit && (
                          <Button onClick={() => setIsEditing(true)} className="font-hebden">
                            <Icon icon="mdi:pencil" width="20" height="20" />
                            Edit
                          </Button>
                      )}
                    </div>
                    {team.description && (
                        <p className="text-foreground font-nunito">{team.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-muted-foreground font-nunito">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:account-group" width="16" height="16" />
                    {team._count?.members || team.members.length} members
                  </span>
                      {team._count?.resources !== undefined && (
                          <span className="flex items-center gap-1">
                      <Icon icon="mdi:package-variant" width="16" height="16" />
                            {team._count.resources} resources
                    </span>
                      )}
                    </div>
                    {(team.websiteUrl || team.discordUrl) && (
                        <div className="flex gap-3">
                          {team.websiteUrl && (
                              <a
                                  href={team.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-nunito text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:web" width="16" height="16" />
                                Website
                              </a>
                          )}
                          {team.discordUrl && (
                              <a
                                  href={team.discordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-nunito text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:discord" width="16" height="16" />
                                Discord
                              </a>
                          )}
                        </div>
                    )}
                  </div>
              ) : (
                  <form onSubmit={handleUpdateTeam} className="space-y-4">
                    <div>
                      <label className="block text-sm font-nunito text-foreground mb-1">Display Name</label>
                      <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                          required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-nunito text-foreground mb-1">Description</label>
                      <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-nunito text-foreground mb-1">Website URL</label>
                      <input
                          type="url"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-nunito text-foreground mb-1">Discord URL</label>
                      <input
                          type="url"
                          value={formData.discordUrl}
                          onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="font-hebden">
                        <Icon icon="mdi:check" width="20" height="20" />
                        Save Changes
                      </Button>
                      <Button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              displayName: team.displayName,
                              description: team.description || '',
                              websiteUrl: team.websiteUrl || '',
                              discordUrl: team.discordUrl || '',
                            });
                          }}
                          variant="outline"
                          className="font-hebden"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
              )}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-secondary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-hebden text-foreground">Team Members</h3>
            {canEdit && (
                <Button onClick={() => setShowAddMember(!showAddMember)} className="font-hebden">
                  <Icon icon="mdi:plus" width="20" height="20" />
                  Add Member
                </Button>
            )}
          </div>

          {/* Add Member Form */}
          {showAddMember && (
              <form onSubmit={handleAddMember} className="mb-6 p-4 bg-background/50 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-nunito text-foreground mb-1">User ID</label>
                  <input
                      type="text"
                      value={newMember.userId}
                      onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                      required
                      placeholder="user-id-123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-nunito text-foreground mb-1">Role</label>
                  <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'OWNER' | 'ADMIN' | 'MEMBER' })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg font-nunito"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    {isOwner && <option value="OWNER">Owner</option>}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="font-hebden">
                    <Icon icon="mdi:check" width="20" height="20" />
                    Add
                  </Button>
                  <Button
                      type="button"
                      onClick={() => {
                        setShowAddMember(false);
                        setNewMember({ userId: '', role: 'MEMBER' });
                      }}
                      variant="outline"
                      className="font-hebden"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
          )}

          {/* Members List */}
          <div className="space-y-3">
            {team.members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.image} alt={member.user.username} />
                      <AvatarFallback>{member.user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-nunito font-semibold text-foreground">{member.user.username}</p>
                      <p className="text-sm text-muted-foreground font-nunito">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {canEdit && member.user.id !== session?.user?.id ? (
                        <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as 'OWNER' | 'ADMIN' | 'MEMBER')}
                            className="px-3 py-1 bg-background border border-border rounded-lg font-nunito text-sm"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                          {isOwner && <option value="OWNER">Owner</option>}
                        </select>
                    ) : (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg font-nunito text-sm">
                    {member.role}
                  </span>
                    )}
                    {canEdit && member.user.email !== session?.user?.email && (
                        <Button
                            onClick={() => handleRemoveMember(member.id)}
                            variant="destructive"
                            size="icon-sm"
                            className="font-hebden"
                        >
                          <Icon icon="mdi:delete" width="16" height="16" />
                        </Button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        {isOwner && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
              <h3 className="text-xl font-bold font-hebden text-destructive mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <p className="text-foreground font-nunito text-sm">
                  Once you delete a team, there is no going back. Please be certain.
                </p>
                <Button onClick={handleDeleteTeam} variant="destructive" className="font-hebden">
                  <Icon icon="mdi:delete-forever" width="20" height="20" />
                  Delete Team
                </Button>
              </div>
            </div>
        )}
      </div>
  );
}