import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, UserCheck, ClipboardCheck, Shield, Book, FileText, 
  Building2, AlertCircle, Stethoscope, Scale, Heart,
  LayoutGrid, List, ChevronDown, ExternalLink, Filter, Search
} from 'lucide-react';

// Framework data based on compliance requirements
const frameworks = [
  // Federal Requirements
  {
    id: 'medicare-cops',
    title: 'Medicare Conditions of Participation',
    subtitle: 'CMS Requirements',
    description: 'Federal requirements for home health agencies participating in Medicare, covering patient rights, care planning, and quality assessment.',
    authority: 'CMS',
    citation: '42 CFR Part 484',
    published: 'Jan 13, 2017',
    effective: 'Jan 13, 2018',
    jurisdiction: 'Federal',
    category: 'Compliance/Operations',
    crossReferences: ['HIPAA', 'OIG Guidance'],
    icon: Building2,
    progress: 92,
    sourceLink: 'https://www.cms.gov/medicare/health-safety-standards/guidance-for-laws-regulations/home-health-agencies'
  },
  {
    id: 'hipaa',
    title: 'HIPAA Privacy & Security Rules',
    subtitle: 'HHS OCR Requirements',
    description: 'Federal privacy and security requirements for protected health information (PHI) handling and safeguards.',
    authority: 'HHS OCR',
    citation: '45 CFR Parts 160, 164',
    published: 'Dec 28, 2000',
    effective: 'Apr 14, 2003',
    jurisdiction: 'Federal',
    category: 'Privacy/Security',
    crossReferences: ['CMS CoPs'],
    icon: Shield,
    progress: 88,
    sourceLink: 'https://www.hhs.gov/hipaa/for-professionals/index.html'
  },
  {
    id: 'oig-compliance',
    title: 'OIG Compliance Program Guidance',
    subtitle: 'HHS OIG Requirements',
    description: 'Voluntary compliance program guidance for home health agencies to prevent fraud, waste, and abuse.',
    authority: 'HHS OIG',
    citation: '63 FR 42410 (1998); GCPG 2023',
    published: 'Aug 7, 1998',
    effective: 'Voluntary',
    jurisdiction: 'Federal',
    category: 'Compliance',
    crossReferences: ['Anti-Kickback', 'False Claims'],
    icon: Book,
    progress: 85,
    sourceLink: 'https://oig.hhs.gov/compliance/compliance-guidance/'
  },
  {
    id: 'medicare-f2f',
    title: 'Medicare Home Health Face-to-Face',
    subtitle: 'CMS Requirements',
    description: 'Face-to-face encounter requirements for Medicare home health certification.',
    authority: 'CMS',
    citation: '42 CFR §424.22(a)(1)(v)',
    published: 'Nov 17, 2010',
    effective: 'Jan 1, 2011',
    jurisdiction: 'Federal',
    category: 'Compliance/Funding',
    crossReferences: ['Medicare CoPs'],
    icon: Stethoscope,
    progress: 90,
    sourceLink: 'https://www.cms.gov/files/document/may-20-2014-home-health-face-face-special-open-door-forum-presentation-508-cleanpdf'
  },
  {
    id: 'medicaid-hh',
    title: 'Medicaid Home Health Services',
    subtitle: 'CMS Requirements',
    description: 'Federal requirements for Medicaid home health services including face-to-face requirements.',
    authority: 'CMS',
    citation: '42 CFR §440.70',
    published: 'Feb 2, 2016',
    effective: 'Jul 1, 2016',
    jurisdiction: 'Federal',
    category: 'Compliance/Operations',
    crossReferences: ['Medicare F2F'],
    icon: Heart,
    progress: 87,
    sourceLink: 'https://www.federalregister.gov/documents/2016/02/02/2016-01585/medicaid-program-face-to-face-requirements-for-home-health-services-policy-changes-and'
  },
  
  // Minnesota Requirements
  {
    id: 'mn-licensing',
    title: 'Minnesota Home Care Provider Licensing',
    subtitle: 'MDH Requirements',
    description: 'State licensing requirements for home care providers operating in Minnesota.',
    authority: 'Minnesota Department of Health (MDH)',
    citation: 'Minn. Stat. §144A.471',
    published: '2013',
    effective: 'Jul 1, 2014',
    jurisdiction: 'Minnesota',
    category: 'Compliance/Operations',
    crossReferences: ['Minn. Stat. §245C'],
    icon: FileText,
    progress: 95,
    sourceLink: 'https://www.revisor.mn.gov/statutes/cite/144A.471'
  },
  {
    id: 'mn-operational',
    title: 'Minnesota Home Care Operational Standards',
    subtitle: 'MDH Requirements',
    description: 'Operational standards for home care providers in Minnesota.',
    authority: 'MDH',
    citation: 'Minn. Stat. §§144A.479–144A.4798',
    published: '2013',
    effective: 'Jul 1, 2014',
    jurisdiction: 'Minnesota',
    category: 'Operations/Compliance',
    crossReferences: ['Federal CoPs'],
    icon: Scale,
    progress: 91,
    sourceLink: 'https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html'
  },
  {
    id: 'mn-bill-of-rights',
    title: 'Minnesota Home Care Bill of Rights',
    subtitle: 'MDH Requirements',
    description: 'Client rights and protections for home care recipients in Minnesota.',
    authority: 'MDH',
    citation: 'Minn. Stat. §144A.44',
    published: '1987; amended 2019',
    effective: 'Aug 1, 1988',
    jurisdiction: 'Minnesota',
    category: 'Compliance',
    crossReferences: ['Vulnerable Adults Act'],
    icon: Shield,
    progress: 93,
    sourceLink: 'https://www.revisor.mn.gov/statutes/cite/144A.44'
  },
  {
    id: 'mn-documentation',
    title: 'Minnesota Home Care Documentation Standards',
    subtitle: 'MDH Requirements',
    description: 'Documentation requirements for home care services in Minnesota.',
    authority: 'MDH',
    citation: 'Minn. Stat. §§144A.4791–144A.4792',
    published: '2013',
    effective: 'Jul 1, 2014',
    jurisdiction: 'Minnesota',
    category: 'Documentation/Compliance',
    crossReferences: ['Federal CoPs'],
    icon: FileText,
    progress: 89,
    sourceLink: 'https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html'
  },
  {
    id: 'mn-quality',
    title: 'Minnesota Home Care Quality Improvement',
    subtitle: 'MDH Requirements',
    description: 'Quality improvement program requirements for Minnesota home care providers.',
    authority: 'MDH',
    citation: 'Minn. Stat. §144A.483',
    published: '2013',
    effective: '2014',
    jurisdiction: 'Minnesota',
    category: 'Operations/Compliance',
    crossReferences: ['42 CFR 484.65'],
    icon: AlertCircle,
    progress: 86,
    sourceLink: 'https://www.health.state.mn.us/facilities/regulation/homecare/laws/statutes.html'
  }
];

function ComplianceView() {
  const navigate = useNavigate();
  const [view, setView] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'All' | 'Federal' | 'Minnesota'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<'title' | 'authority' | 'progress'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = selectedJurisdiction === 'All' || framework.jurisdiction === selectedJurisdiction;
    const matchesCategory = selectedCategory === 'All' || framework.category.includes(selectedCategory);
    return matchesSearch && matchesJurisdiction && matchesCategory;
  }).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'title':
        return a.title.localeCompare(b.title) * direction;
      case 'authority':
        return a.authority.localeCompare(b.authority) * direction;
      case 'progress':
        return (a.progress - b.progress) * direction;
      default:
        return 0;
    }
  });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const categories = Array.from(new Set(frameworks.flatMap(f => 
    f.category.split('/').map(c => c.trim())
  )));

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Frameworks</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(prev => prev === 'card' ? 'list' : 'card')}
              className="p-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              title={view === 'card' ? 'Switch to list view' : 'Switch to card view'}
            >
              {view === 'card' ? <List size={20} /> : <LayoutGrid size={20} />}
            </button>
            <button 
              onClick={() => navigate('/compliance/controls')}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              View controls
            </button>
          </div>
        </header>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
            Jurisdiction
            <ChevronDown size={16} />
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
            Category
            <ChevronDown size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Filter size={20} />
          </button>
        </div>

        {view === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((framework) => (
              <div
                key={framework.id}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-purple-600">{framework.subtitle}</span>
                    </div>
                    <h3 className="font-medium mb-2">{framework.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{framework.description}</p>
                    
                    {framework.authority && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Authority</span>
                          <span>{framework.authority}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Citation</span>
                          <span>{framework.citation}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Effective</span>
                          <span>{framework.effective}</span>
                        </div>
                      </div>
                    )}

                    {framework.progress !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                              className="text-gray-100"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="transparent"
                              r="20"
                              cx="24"
                              cy="24"
                            />
                            <circle
                              className={framework.progress >= 95 ? 'text-green-500' : 'text-purple-500'}
                              strokeWidth="4"
                              strokeDasharray={125.6}
                              strokeDashoffset={125.6 * ((100 - framework.progress) / 100)}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="20"
                              cx="24"
                              cy="24"
                            />
                          </svg>
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold">
                            {framework.progress}%
                          </span>
                        </div>
                      </div>
                    )}

                    {framework.crossReferences && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {framework.crossReferences.map((ref, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <framework.icon className="text-purple-600" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {framework.jurisdiction || framework.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={framework.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      onClick={() => navigate('/compliance/controls')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Review tasks
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Framework
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('authority')}
                  >
                    Authority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Citation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('progress')}
                  >
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFrameworks.map((framework) => (
                  <tr key={framework.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <framework.icon className="text-purple-600" size={16} />
                        </div>
                        <div>
                          <div className="font-medium">{framework.title}</div>
                          <div className="text-sm text-gray-500">{framework.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{framework.authority}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{framework.citation}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{framework.effective}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {framework.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 w-24 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              framework.progress >= 95 ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${framework.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{framework.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <a
                          href={framework.sourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button 
                          onClick={() => navigate('/compliance/controls')}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Review tasks
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default ComplianceView;