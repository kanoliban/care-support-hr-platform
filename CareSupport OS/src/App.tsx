import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './components/resources/context/ProgressContext';
import { SearchProvider } from './components/resources/context/SearchContext';
import { SystemSettingsProvider } from './contexts/SystemSettingsContext';
import { CareCoordinationProvider } from './contexts/CareCoordinationContext';
import CareCoordinationSidebar from './components/CareCoordinationSidebar';
import CommandCenterView from './components/CommandCenterView';
import ComplianceView from './components/ComplianceView';
import ControlsView from './components/ControlsView';
import PolicyListView from './components/policy/PolicyListView';
import PolicyDetailView from './components/policy/PolicyDetailView';
import DocumentsView from './components/DocumentsView';
import AuditsView from './components/AuditsView';
import ReportsView from './components/ReportsView';
import ResourcesView from './components/resources/ResourcesView';
import GettingStartedView from './components/resources/GettingStartedView';
import KnowledgeBaseView from './components/resources/KnowledgeBaseView';
import ResourceLibraryView from './components/resources/ResourceLibraryView';
import CommunityGuideView from './components/resources/CommunityGuideView';
import ClientListView from './components/client/ClientListView';
import ClientDetailView from './components/client/ClientDetailView';
import ClientScheduleView from './components/client/ClientScheduleView';
import CaregiverListView from './components/caregiver/CaregiverListView';
import CaregiverDetailView from './components/caregiver/CaregiverDetailView';
import CaregiverScheduleView from './components/caregiver/CaregiverScheduleView';
import CareTeamView from './components/CareTeamView';
import CareRecipientView from './components/CareRecipientView';
import CareCompliance from './components/CareCompliance';
import CoverageIntelligence from './components/CoverageIntelligence';
import TeamContactsView from './components/TeamContactsView';
import TeamMemberDetailView from './components/TeamMemberDetailView';
import FindCoverageView from './components/FindCoverageView';
import SendUpdateView from './components/SendUpdateView';
import EmergencyContactsView from './components/EmergencyContactsView';
import BillingView from './components/billing/BillingView';
import SchedulingView from './components/scheduling/SchedulingView';
import SettingsView from './components/settings/SettingsView';
import PreferencesView from './components/settings/PreferencesView';
import NotificationsView from './components/settings/NotificationsView';
import PermissionsView from './components/settings/PermissionsView';
import AccessibilityView from './components/settings/AccessibilityView';
import CareProfileView from './components/settings/CareProfileView';
import CareStandardsView from './components/settings/CareStandardsView';
// Admin components temporarily disabled for CareSupport OS transformation
// import { 
//   DashboardView, UserListView, SystemSettingsView,
//   IntegrationsView, AuditLogsView, AdvancedComplianceView 
// } from './components/admin';

function App() {
  return (
    <SystemSettingsProvider>
      <CareCoordinationProvider>
        <Router>
        <ProgressProvider>
          <SearchProvider>
            <div className="flex h-screen w-full overflow-hidden bg-claude">
              <CareCoordinationSidebar />
              <main className="flex-1 relative">
                <div className="absolute inset-0 overflow-auto">
                  <Routes>
                    <Route path="/" element={<CommandCenterView />} />
                    <Route path="/schedule" element={<SchedulingView />} />
                    <Route path="/schedule/gaps" element={<CoverageIntelligence />} />
                    <Route path="/schedule/coverage" element={<ClientScheduleView />} />
                    <Route path="/schedule/team" element={<CareTeamView />} />
                    <Route path="/schedule/team/:memberId" element={<TeamMemberDetailView />} />
                    <Route path="/schedule/team/contacts" element={<TeamContactsView />} />
                    <Route path="/actions/coverage" element={<FindCoverageView />} />
                    <Route path="/actions/update" element={<SendUpdateView />} />
                    <Route path="/actions/emergency" element={<EmergencyContactsView />} />
                    <Route path="/compliance" element={<ComplianceView />} />
                    <Route path="/compliance/controls" element={<ControlsView />} />
                    <Route path="/compliance/policies" element={<PolicyListView />} />
                    <Route path="/compliance/policies/:policyId" element={<PolicyDetailView />} />
                    <Route path="/compliance/documents" element={<DocumentsView />} />
                    <Route path="/compliance/audits" element={<AuditsView />} />
                    <Route path="/care-recipient" element={<CareRecipientView />} />
                    <Route path="/clients" element={<ClientListView />} />
                    <Route path="/clients/schedule" element={<ClientScheduleView />} />
                    <Route path="/clients/:clientId" element={<ClientDetailView />} />
                    <Route path="/caregivers" element={<CaregiverListView />} />
                    <Route path="/caregivers/schedule" element={<CaregiverScheduleView />} />
                    <Route path="/caregivers/:caregiverId" element={<CaregiverDetailView />} />
                    <Route path="/standards" element={<CareCompliance />} />
                    <Route path="/billing" element={<BillingView />} />
                    <Route path="/reports" element={<ReportsView />} />
                    <Route path="/resources" element={<ResourcesView />} />
                    <Route path="/resources/getting-started" element={<GettingStartedView />} />
                    <Route path="/resources/knowledge-base" element={<KnowledgeBaseView />} />
                    <Route path="/resources/library" element={<ResourceLibraryView />} />
                    <Route path="/resources/community" element={<CommunityGuideView />} />
                    <Route path="/settings" element={<SettingsView />} />
                    <Route path="/settings/care-profile" element={<CareProfileView />} />
                    <Route path="/settings/care-standards" element={<CareStandardsView />} />
                    <Route path="/settings/preferences" element={<PreferencesView />} />
                    <Route path="/settings/notifications" element={<NotificationsView />} />
                    <Route path="/settings/permissions" element={<PermissionsView />} />
                    <Route path="/settings/accessibility" element={<AccessibilityView />} />
                    {/* Admin routes temporarily disabled for CareSupport OS transformation */}
                    {/* <Route path="/admin" element={<DashboardView />} /> */}
                    {/* <Route path="/admin/users" element={<UserListView />} /> */}
                    {/* <Route path="/admin/settings" element={<SystemSettingsView />} /> */}
                    {/* <Route path="/admin/integrations" element={<IntegrationsView />} /> */}
                    {/* <Route path="/admin/logs" element={<AuditLogsView />} /> */}
                    {/* <Route path="/admin/compliance" element={<AdvancedComplianceView />} /> */}
                  </Routes>
                </div>
              </main>
            </div>
          </SearchProvider>
        </ProgressProvider>
        </Router>
      </CareCoordinationProvider>
    </SystemSettingsProvider>
  );
}

export default App;