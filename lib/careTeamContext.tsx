'use client';

import * as React from 'react';

export interface CareTeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roles: string[];
  availability: string;
  status: 'active' | 'inactive' | 'pending';
  invitedAt?: Date;
  acceptedAt?: Date;
}

export interface CareTeamInvitation {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contactType: 'email' | 'phone';
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: Date;
  invitedBy: string;
}

interface CareTeamContextType {
  teamMembers: CareTeamMember[];
  pendingInvitations: CareTeamInvitation[];
  addTeamMember: (member: Omit<CareTeamMember, 'id' | 'status'>) => void;
  inviteToTeam: (invitation: Omit<CareTeamInvitation, 'id' | 'status' | 'invitedAt'>) => Promise<void>;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;
  updateMemberStatus: (memberId: string, status: CareTeamMember['status']) => void;
}

const CareTeamContext = React.createContext<CareTeamContextType | undefined>(undefined);

export function CareTeamProvider({ children }: { children: React.ReactNode }) {
  const [teamMembers, setTeamMembers] = React.useState<CareTeamMember[]>([
    {
      id: 'jim-nelson',
      name: 'Jim Nelson',
      roles: ['Primary PCA'],
      availability: 'M-F 9am-5pm',
      status: 'active'
    },
    {
      id: 'jennifer-smith',
      name: 'Jennifer Smith',
      roles: ['Backup PCA'],
      availability: 'M,T 8pm-8am',
      status: 'active'
    },
    {
      id: 'elena-chen',
      name: 'Elena Chen',
      roles: ['Family', 'Backup PCA'],
      availability: 'Weekends',
      status: 'active'
    },
    {
      id: 'sarah-martinez',
      name: 'Sarah Martinez',
      roles: ['Family', 'Backup PCA'],
      availability: 'On-call',
      status: 'active'
    },
    {
      id: 'uncle-jim',
      name: 'Uncle Jim',
      roles: ['Family', 'Backup PCA'],
      availability: 'On-call',
      status: 'active'
    },
    {
      id: 'dan',
      name: 'Dan (Bro in-law)',
      roles: ['Family', 'Backup PCA'],
      availability: 'On-call',
      status: 'active'
    }
  ]);

  const [pendingInvitations, setPendingInvitations] = React.useState<CareTeamInvitation[]>([]);

  const addTeamMember = React.useCallback((member: Omit<CareTeamMember, 'id' | 'status'>) => {
    const newMember: CareTeamMember = {
      ...member,
      id: `member-${Date.now()}`,
      status: 'active'
    };
    setTeamMembers(prev => [...prev, newMember]);
  }, []);

  const inviteToTeam = React.useCallback(async (invitation: Omit<CareTeamInvitation, 'id' | 'status' | 'invitedAt'>) => {
    const newInvitation: CareTeamInvitation = {
      ...invitation,
      id: `invitation-${Date.now()}`,
      status: 'pending',
      invitedAt: new Date()
    };

    // Add to pending invitations
    setPendingInvitations(prev => [...prev, newInvitation]);

    // Add as inactive team member
    const newMember: CareTeamMember = {
      id: newInvitation.id,
      name: invitation.name,
      email: invitation.email,
      phone: invitation.phone,
      roles: ['Invited Member'],
      availability: 'Pending',
      status: 'inactive',
      invitedAt: newInvitation.invitedAt
    };
    setTeamMembers(prev => [...prev, newMember]);

    // TODO: In a real app, this would send an actual invitation
    console.log('Invitation sent:', newInvitation);
  }, []);

  const acceptInvitation = React.useCallback((invitationId: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    setTeamMembers(prev => prev.map(member => 
      member.id === invitationId 
        ? { ...member, status: 'active' as const, acceptedAt: new Date() }
        : member
    ));
  }, []);

  const declineInvitation = React.useCallback((invitationId: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    setTeamMembers(prev => prev.filter(member => member.id !== invitationId));
  }, []);

  const updateMemberStatus = React.useCallback((memberId: string, status: CareTeamMember['status']) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status } : member
    ));
  }, []);

  const value = React.useMemo(() => ({
    teamMembers,
    pendingInvitations,
    addTeamMember,
    inviteToTeam,
    acceptInvitation,
    declineInvitation,
    updateMemberStatus
  }), [teamMembers, pendingInvitations, addTeamMember, inviteToTeam, acceptInvitation, declineInvitation, updateMemberStatus]);

  return (
    <CareTeamContext.Provider value={value}>
      {children}
    </CareTeamContext.Provider>
  );
}

export function useCareTeam() {
  const context = React.useContext(CareTeamContext);
  if (context === undefined) {
    throw new Error('useCareTeam must be used within a CareTeamProvider');
  }
  return context;
}
