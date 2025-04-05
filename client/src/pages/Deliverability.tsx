import { useState } from 'react';
import InstallServer from '@/components/deliverability/InstallServer';
import ReinstallServer from '@/components/deliverability/ReinstallServer';
import MultiServer from '@/components/deliverability/MultiServer';
import ServerList from '@/components/deliverability/ServerList';
import PowerMtaPreview from '@/components/deliverability/PowerMtaPreview';
import PowerMtaSettings from '@/components/deliverability/PowerMtaSettings';

const Deliverability = () => {
  const [activeTab, setActiveTab] = useState('install-server');
  
  const tabs = [
    { id: 'install-server', label: 'Install Server' },
    { id: 'reinstall-server', label: 'Reinstall Server' },
    { id: 'multi-server', label: 'Multi-Server Install' },
    { id: 'server-list', label: 'Server List' },
    { id: 'powermta-preview', label: 'PowerMTA Preview' },
    { id: 'powermta-settings', label: 'PowerMTA Settings' }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Server Deliverability</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your email sending infrastructure</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium ${
                activeTab === tab.id 
                  ? 'border-primary-500 text-primary-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } focus:outline-none`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'install-server' && <InstallServer />}
      {activeTab === 'reinstall-server' && <ReinstallServer />}
      {activeTab === 'multi-server' && <MultiServer />}
      {activeTab === 'server-list' && <ServerList />}
      {activeTab === 'powermta-preview' && <PowerMtaPreview />}
      {activeTab === 'powermta-settings' && <PowerMtaSettings />}
    </div>
  );
};

export default Deliverability;
