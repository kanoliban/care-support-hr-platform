import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle, ToggleLeft as Toggle, Save, Info, Check } from 'lucide-react';

const complianceSettings = [
  {
    id: 'evv-tx',
    category: 'EVV',
    title: 'Texas EVV Requirements',
    description: 'Enable advanced EVV validation rules specific to Texas Medicaid requirements',
    enabled: true,
    warning: 'Changing this setting will affect how EVV data is validated and submitted'
  },
  {
    id: 'cred-multi',
    category: 'Credentialing',
    title: 'Multi-State License Tracking',
    description: 'Track and validate caregiver licenses across multiple states',
    enabled: false,
    warning: null
  },
  {
    id: 'poc-custom',
    category: 'Plan-of-Care',
    title: 'Custom Care Plan Templates',
    description: 'Enable agency-specific care plan templates and validation rules',
    enabled: true,
    warning: null
  }
];

function AdvancedComplianceView() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(complianceSettings);

  const handleToggle = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </button>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Advanced Compliance Settings</h1>
            <p className="text-gray-600 mt-1">Configure state-specific rules and compliance controls</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </header>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These settings affect how your compliance engine processes controls globally. 
                  Changes may impact existing workflows and validations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{setting.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {setting.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      {setting.warning && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
                          <Info size={14} />
                          <span>{setting.warning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(setting.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      setting.enabled ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={setting.enabled}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-medium mb-4">Compliance Framework Status</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">EVV Framework</div>
                  <div className="font-medium text-green-600">Active</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">All rules up to date</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credentialing</div>
                  <div className="font-medium text-green-600">Active</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">All rules up to date</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Plan-of-Care</div>
                  <div className="font-medium text-yellow-600">Update Available</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">New rules pending</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdvancedComplianceView;