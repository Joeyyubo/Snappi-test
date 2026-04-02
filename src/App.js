import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavItem,
  NavList,
  Masthead,
  MastheadToggle,
  MastheadContent,
  PageToggleButton,
  Button,
  Flex,
  FlexItem,
  Title
} from '@patternfly/react-core';
import {
  BarsIcon,
  CogIcon,
  BellIcon,
  ThIcon,
} from '@patternfly/react-icons';
import { FaQuestionCircleRegular } from './components/FaQuestionCircleRegular';

import GatewaysPage from './components/GatewaysPage';
import RoutesPage from './components/RoutesPage';
import GatewayDetailsPage from './components/GatewayDetailsPage';
import CreateGatewayPage from './components/CreateGatewayPage';
import CreateHTTPRoutePage from './components/CreateHTTPRoutePage';
import MCPServerTemplatePage from './components/MCPServerTemplatePage';
import MCPServerConfigPage from './components/MCPServerConfigPage';
import MCPServerDiscoveryPage from './components/MCPServerDiscoveryPage';
import MCPServerTestConnectionPage from './components/MCPServerTestConnectionPage';
import MCPServerLogsPage from './components/MCPServerLogsPage';
import APIKeyApprovalsPage from './components/APIKeyApprovalsPage';
import ObservabilityPage from './components/ObservabilityPage';
import APIDetailsPage from './components/APIDetailsPage';
import APICredentialsPage from './components/APICredentialsPage';
import APIKeyDetailPage from './components/APIKeyDetailPage';
import RevealApiKeyModal from './components/RevealApiKeyModal';
import EditApiKeyModal from './components/EditApiKeyModal';
import DeleteApiKeyModal from './components/DeleteApiKeyModal';
import RequestApiKeyModal from './components/RequestApiKeyModal';
import RequestApiKeySuccessToast from './components/RequestApiKeySuccessToast';
import APIKeyUpdatedToast from './components/APIKeyUpdatedToast';
import APIKeyDeletedToast from './components/APIKeyDeletedToast';
import {
  buildCredentialsData,
  DEMO_CURRENT_USER_OWNER,
  REQUESTED_TIME_DISPLAY
} from './data/apiCredentialsModel';

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('api-key-approvals');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isCreateGatewayOpen, setIsCreateGatewayOpen] = useState(false);
  const [isCreateHTTPRouteOpen, setIsCreateHTTPRouteOpen] = useState(false);
  const [isCreateHTTPRouteFromRoutes, setIsCreateHTTPRouteFromRoutes] = useState(false);
  const [mcpServerPageType, setMcpServerPageType] = useState(null); // 'template', 'config', 'discovery'
  const [mcpServerAction, setMcpServerAction] = useState(null); // 'test-connection', 'view-logs'
  const [selectedMCPServer, setSelectedMCPServer] = useState(null);
  const [selectedApiDetails, setSelectedApiDetails] = useState(null); // Roni name when viewing product details from Toki approval / My Toki link
  /** Where Roni product details was opened from (drives Request Toki modal + toast routing). */
  const [productDetailSource, setProductDetailSource] = useState(null); // 'approval-list' | 'my-toki'
  const [selectedApiKey, setSelectedApiKey] = useState(null); // credential row when opening API key details (Active / Pending / Rejected)
  const [revealedKeyIds, setRevealedKeyIds] = useState(() => new Set());
  const [revealModalRowId, setRevealModalRowId] = useState(null);
  const [credentialsList, setCredentialsList] = useState(() => buildCredentialsData());
  const credentialNamesForRequestModal = useMemo(
    () => credentialsList.map((c) => c.name),
    [credentialsList]
  );
  const [editCredentialId, setEditCredentialId] = useState(null);
  const [deleteCredentialId, setDeleteCredentialId] = useState(null);
  const [requestApiKeyOpen, setRequestApiKeyOpen] = useState(false);
  const [requestKeySuccessToast, setRequestKeySuccessToast] = useState(null);
  const [editKeySuccessToast, setEditKeySuccessToast] = useState(null);
  const [deleteKeySuccessToast, setDeleteKeySuccessToast] = useState(null);
  /** After closing API key detail opened from catalog API keys tab, reopen API details on API keys tab. */
  const [resumeApiDetailsKeysTab, setResumeApiDetailsKeysTab] = useState(false);
  /** Inline success on API key details after Request API key from that page (no nav away). */
  const [keyDetailRequestSuccessAlert, setKeyDetailRequestSuccessAlert] = useState(false);
  const requestModalOpenedFromKeyDetailRef = useRef(false);
  /** True when request modal opened from API catalog → API key detail (rejected); success uses toast + View details → new key. */
  const requestModalFromCatalogKeyDetailRef = useRef(false);
  /** True when opened from API catalog → API product details (keys tab), not key detail; View details stays in catalog. */
  const requestModalFromCatalogApiDetailsRef = useRef(false);
  /** True when opened from API key approval → API product details; success toast returns here. */
  const requestModalFromApprovalRef = useRef(false);

  const editingCredential = editCredentialId ? credentialsList.find((c) => c.id === editCredentialId) : null;
  const deletingCredential = deleteCredentialId ? credentialsList.find((c) => c.id === deleteCredentialId) : null;

  const handleEditApiKeySave = (id, { name, tier, useCase }) => {
    let apiName = '';
    let updatesSummary = '';
    setCredentialsList((prev) => {
      const prevRow = prev.find((r) => r.id === id);
      if (prevRow) {
        apiName = prevRow.api;
        const lines = [];
        if (prevRow.name !== name) lines.push(`Toki name updated to "${name}".`);
        if (prevRow.tier !== tier) lines.push(`Tier updated to ${tier}.`);
        const prevUc = (prevRow.useCase || '').trim();
        const nextUc = (useCase || '').trim();
        if (prevUc !== nextUc) {
          lines.push(nextUc || 'Use case cleared.');
        }
        updatesSummary =
          lines.length > 0 ? lines.join(' ') : 'Changes saved. The Toki is pending approval.';
      }
      return prev.map((r) => (r.id === id ? { ...r, name, tier, useCase, status: 'Pending' } : r));
    });
    setSelectedApiKey((prev) =>
      prev && prev.id === id ? { ...prev, name, tier, useCase, status: 'Pending' } : prev
    );
    setRequestKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    setEditKeySuccessToast({
      api: apiName,
      keyName: name,
      updates: updatesSummary,
      credentialId: id
    });
  };

  const openRequestApiKeyModal = useCallback(() => {
    setRequestKeySuccessToast(null);
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    setRequestApiKeyOpen(true);
  }, []);

  /** My API keys list — Request API key (clear modal source refs so success toast targets My API keys). */
  const openRequestFromMyKeysList = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = false;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = false;
    openRequestApiKeyModal();
  }, [openRequestApiKeyModal]);

  /** From Rejected API key details (My API keys): open request modal on current page; inline success alert after submit. */
  const openRequestModalFromKeyDetail = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = true;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = false;
    openRequestApiKeyModal();
  }, [openRequestApiKeyModal]);

  /** From Rejected API key details (API catalog → API details → keys tab): same modal; toast + navigate to new key on View details. */
  const openRequestModalFromCatalogKeyDetail = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = true;
    requestModalFromCatalogKeyDetailRef.current = true;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = false;
    openRequestApiKeyModal();
  }, [openRequestApiKeyModal]);

  /** From API catalog product details page (API keys tab / Request API key); View details opens new key under same API. */
  const openRequestModalFromCatalogApiDetails = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = false;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = true;
    requestModalFromApprovalRef.current = false;
    openRequestApiKeyModal();
  }, [openRequestApiKeyModal]);

  /** From API key approval flow → API product details (Request API key). */
  const openRequestModalFromApproval = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = false;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = true;
    openRequestApiKeyModal();
  }, [openRequestApiKeyModal]);

  const closeRequestApiKeyModal = useCallback(() => {
    requestModalOpenedFromKeyDetailRef.current = false;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = false;
    setRequestApiKeyOpen(false);
  }, []);

  const handleRequestApiKeySubmit = ({ api: apiName, tier, name, useCase }) => {
    const id = `cred-${Date.now()}`;
    let createdName = '';
    setCredentialsList((prev) => {
      createdName = (name && name.trim()) || `Toki-${prev.length + 1}`;
      return [
        {
          id,
          name: createdName,
          owner: DEMO_CURRENT_USER_OWNER,
          api: apiName,
          status: 'Pending',
          tier,
          apiKeyState: 'empty',
          requestedTime: REQUESTED_TIME_DISPLAY,
          useCase: useCase || ''
        },
        ...prev
      ];
    });
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    const fromKeyDetail = requestModalOpenedFromKeyDetailRef.current;
    const fromCatalogKeyDetail = requestModalFromCatalogKeyDetailRef.current;
    const fromCatalogApiDetails = requestModalFromCatalogApiDetailsRef.current;
    const fromApprovalDetail = requestModalFromApprovalRef.current;
    requestModalOpenedFromKeyDetailRef.current = false;
    requestModalFromCatalogKeyDetailRef.current = false;
    requestModalFromCatalogApiDetailsRef.current = false;
    requestModalFromApprovalRef.current = false;
    if (fromKeyDetail) {
      if (fromCatalogKeyDetail) {
        setKeyDetailRequestSuccessAlert(false);
        setRequestKeySuccessToast({
          api: apiName,
          keyName: createdName,
          credentialId: id,
          viewDetailsTarget: 'catalog'
        });
      } else {
        setRequestKeySuccessToast(null);
        setKeyDetailRequestSuccessAlert(true);
      }
    } else if (fromCatalogApiDetails) {
      setKeyDetailRequestSuccessAlert(false);
      setRequestKeySuccessToast({
        api: apiName,
        keyName: createdName,
        credentialId: id,
        viewDetailsTarget: 'catalog'
      });
    } else if (fromApprovalDetail) {
      setKeyDetailRequestSuccessAlert(false);
      setRequestKeySuccessToast({
        api: apiName,
        keyName: createdName,
        credentialId: id,
        viewDetailsTarget: 'approval'
      });
    } else {
      setRequestKeySuccessToast({
        api: apiName,
        keyName: createdName,
        credentialId: id,
        viewDetailsTarget: 'my-keys'
      });
    }
  };

  const dismissRequestKeyToast = useCallback(() => setRequestKeySuccessToast(null), []);

  const handleRequestSuccessViewDetails = useCallback(() => {
    if (!requestKeySuccessToast?.credentialId) return;
    const id = requestKeySuccessToast.credentialId;
    const row = credentialsList.find((c) => c.id === id);
    const target = requestKeySuccessToast.viewDetailsTarget;
    setRequestKeySuccessToast(null);
    if (!row) return;
    if (target === 'approval') {
      setActiveItem('api-key-approvals');
      setSelectedApiDetails(row.api);
      setSelectedApiKey(null);
      return;
    }
    const openKeyInApprovalContext =
      target === 'catalog' ||
      (target !== 'my-keys' &&
        activeItem === 'api-key-approvals' &&
        selectedApiDetails &&
        row.api === selectedApiDetails);
    if (target === 'my-keys') {
      setActiveItem('api-access');
      setSelectedApiDetails(null);
      setSelectedApiKey(row);
    } else if (openKeyInApprovalContext) {
      setActiveItem('api-key-approvals');
      setSelectedApiDetails(row.api);
      setSelectedApiKey(row);
    } else {
      setActiveItem('api-access');
      setSelectedApiDetails(null);
      setSelectedApiKey(row);
    }
  }, [requestKeySuccessToast, credentialsList, activeItem, selectedApiDetails]);

  const dismissEditKeyToast = useCallback(() => setEditKeySuccessToast(null), []);

  const handleEditSuccessViewDetails = useCallback(() => {
    if (!editKeySuccessToast?.credentialId) return;
    const id = editKeySuccessToast.credentialId;
    const row = credentialsList.find((c) => c.id === id);
    setEditKeySuccessToast(null);
    if (!row) return;
    setSelectedApiKey(row);
    if (activeItem === 'api-key-approvals' && selectedApiDetails && row.api === selectedApiDetails) {
      return;
    }
    setActiveItem('api-access');
    setSelectedApiDetails(null);
  }, [editKeySuccessToast, credentialsList, activeItem, selectedApiDetails]);

  const dismissDeleteKeyToast = useCallback(() => setDeleteKeySuccessToast(null), []);

  const consumeResumeApiDetailsKeysTab = useCallback(() => setResumeApiDetailsKeysTab(false), []);

  const handleDeleteApiKeyConfirm = (id) => {
    const row = credentialsList.find((c) => c.id === id);
    const apiName = row?.api ?? '';
    const keyName = row?.name ?? '';

    setCredentialsList((prev) => prev.filter((r) => r.id !== id));
    setSelectedApiKey((prev) => (prev?.id === id ? null : prev));
    setRevealedKeyIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRevealModalRowId((current) => (current === id ? null : current));
    setEditCredentialId((current) => (current === id ? null : current));
    setDeleteCredentialId(null);

    setRequestKeySuccessToast(null);
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast({ api: apiName, keyName });
  };

  /** Jump to Roni product details (Toki approval context) from My Toki. */
  const navigateToApiCatalogDetail = (apiName) => {
    setSelectedApiKey(null);
    setRevealModalRowId(null);
    setEditCredentialId(null);
    setDeleteCredentialId(null);
    setResumeApiDetailsKeysTab(false);
    setProductDetailSource('my-toki');
    setSelectedApiDetails(apiName);
    setActiveItem('api-key-approvals');
  };

  /** From API key approval list into the same API product details (approval context). */
  const navigateToApiCatalogFromApproval = useCallback((apiName) => {
    setSelectedApiKey(null);
    setRevealModalRowId(null);
    setEditCredentialId(null);
    setDeleteCredentialId(null);
    setResumeApiDetailsKeysTab(false);
    setProductDetailSource('approval-list');
    setSelectedApiDetails(apiName);
    setActiveItem('api-key-approvals');
  }, []);

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const onNavSelect = (event, result) => {
    console.log('Navigation selected:', result);
    if (result && result.itemId) {
      console.log('Setting active item to:', result.itemId);
      setActiveItem(result.itemId);
    }
  };

  useEffect(() => {
    setKeyDetailRequestSuccessAlert(false);
  }, [selectedApiKey?.id]);

  const dismissKeyDetailRequestSuccessAlert = useCallback(() => setKeyDetailRequestSuccessAlert(false), []);

  useEffect(() => {
    if (!requestKeySuccessToast) return;
    const eligible =
      (activeItem === 'api-access' && !selectedApiKey) ||
      (activeItem === 'api-key-approvals' && selectedApiDetails);
    if (!eligible) {
      setRequestKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, selectedApiKey, requestKeySuccessToast]);

  useEffect(() => {
    if (!editKeySuccessToast) return;
    const eligible =
      activeItem === 'api-access' ||
      (activeItem === 'api-key-approvals' && selectedApiDetails);
    if (!eligible) {
      setEditKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, editKeySuccessToast]);

  useEffect(() => {
    if (!deleteKeySuccessToast) return;
    const eligible =
      activeItem === 'api-access' ||
      (activeItem === 'api-key-approvals' && selectedApiDetails);
    if (!eligible) {
      setDeleteKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, deleteKeySuccessToast]);

  const handleGatewayNameClick = (gatewayName) => {
    setSelectedGateway(gatewayName);
    setIsGatewayDetailsOpen(true);
  };

  const handleBackToGateways = () => {
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setIsCreateGatewayOpen(false);
    setIsCreateHTTPRouteOpen(false);
  };

  const handleCreateGateway = () => {
    setIsCreateGatewayOpen(true);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setIsCreateHTTPRouteOpen(false);
  };

  const handleCreateHTTPRoute = () => {
    setIsCreateHTTPRouteOpen(true);
    setIsGatewayDetailsOpen(false);
    setIsCreateGatewayOpen(false);
  };

  const handleCreateHTTPRouteFromRoutes = () => {
    setIsCreateHTTPRouteFromRoutes(true);
  };

  const handleBackToGatewayDetails = () => {
    setIsCreateHTTPRouteOpen(false);
    setIsCreateGatewayOpen(false);
  };

  const handleMCPServerPage = (pageType) => {
    console.log('handleMCPServerPage called with:', pageType);
    setMcpServerPageType(pageType);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    // Set activeItem to gateways to maintain navigation state
    setActiveItem('gateways');
    console.log('State updated - mcpServerPageType:', pageType, 'isGatewayDetailsOpen: false');
  };

  const handleBackToGatewayDetailsFromMCPServer = () => {
    setMcpServerPageType(null);
    setMcpServerAction(null);
    setSelectedMCPServer(null);
    setIsGatewayDetailsOpen(true);
  };

  const handleMCPServerAction = (action, serverName) => {
    console.log('handleMCPServerAction called with:', action, serverName);
    setMcpServerAction(action);
    setSelectedMCPServer(serverName);
    setMcpServerPageType(null);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setActiveItem('gateways');
  };

  const masthead = (
    <Masthead>
      <MastheadToggle>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isNavOpen={isNavOpen}
            onNavToggle={onNavToggle}
          >
            <BarsIcon />
          </PageToggleButton>
        </Flex>
      </MastheadToggle>
      
      <MastheadContent>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--pf-t--global--spacer--sm)',
            marginLeft: 'auto'
          }}
        >
          <Button
            variant="plain"
            aria-label="Applications"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <ThIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Notifications"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <BellIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Settings"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <CogIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Help"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <FaQuestionCircleRegular style={{ color: 'inherit' }} />
          </Button>
        </div>
      </MastheadContent>
    </Masthead>
  );

  const navigation = (
    <Nav onSelect={onNavSelect} aria-label="Navigation">
      <NavList>
        <NavItem
          itemId="api-access"
          isActive={activeItem === 'api-access'}
          onClick={() => {
            setActiveItem('api-access');
            setSelectedApiKey(null);
          }}
        >
            My Toki
        </NavItem>
        <NavItem
          itemId="api-key-approvals"
          isActive={activeItem === 'api-key-approvals'}
          onClick={() => {
            setActiveItem('api-key-approvals');
            setSelectedApiDetails(null);
          }}
        >
            Toki approval
        </NavItem>
        <NavItem
          itemId="observability"
          isActive={activeItem === 'observability'}
          onClick={() => setActiveItem('observability')}
        >
          Observability
        </NavItem>
      </NavList>
    </Nav>
  );

  const sidebar = (
    <PageSidebar isNavOpen={isNavOpen}>
      <PageSidebarBody>
        {navigation}
      </PageSidebarBody>
    </PageSidebar>
  );

  const renderContent = () => {
    console.log('renderContent called - mcpServerPageType:', mcpServerPageType, 'mcpServerAction:', mcpServerAction, 'isGatewayDetailsOpen:', isGatewayDetailsOpen, 'activeItem:', activeItem);
    
    // Check MCP Server actions first
    if (mcpServerAction === 'test-connection') {
      console.log('Rendering MCPServerTestConnectionPage');
      return <MCPServerTestConnectionPage serverName={selectedMCPServer} onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerAction === 'view-logs') {
      console.log('Rendering MCPServerLogsPage');
      return <MCPServerLogsPage serverName={selectedMCPServer} onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    // Check MCP Server pages
    if (mcpServerPageType === 'template') {
      console.log('Rendering MCPServerTemplatePage');
      return <MCPServerTemplatePage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerPageType === 'config') {
      console.log('Rendering MCPServerConfigPage');
      return <MCPServerConfigPage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerPageType === 'discovery') {
      console.log('Rendering MCPServerDiscoveryPage');
      return <MCPServerDiscoveryPage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (isCreateHTTPRouteOpen) {
      return <CreateHTTPRoutePage gatewayName={selectedGateway} onBack={handleBackToGatewayDetails} onCancel={handleBackToGatewayDetails} />;
    }
    
    if (isCreateHTTPRouteFromRoutes) {
      return <CreateHTTPRoutePage onBack={() => setIsCreateHTTPRouteFromRoutes(false)} onCancel={() => setIsCreateHTTPRouteFromRoutes(false)} />;
    }
    
    if (isCreateGatewayOpen) {
      return <CreateGatewayPage onBack={handleBackToGateways} onCancel={handleBackToGateways} />;
    }
    
    if (isGatewayDetailsOpen) {
      return <GatewayDetailsPage gatewayName={selectedGateway} onBack={handleBackToGateways} onCreateHTTPRoute={handleCreateHTTPRoute} onMCPServerPage={handleMCPServerPage} onMCPServerAction={handleMCPServerAction} />;
    }
    
    switch (activeItem) {
      case 'observability':
        return <ObservabilityPage />;
      case 'gateways':
        return <GatewaysPage onGatewayNameClick={handleGatewayNameClick} onCreateGateway={handleCreateGateway} />;
      case 'routes':
        return <RoutesPage onCreateHTTPRoute={handleCreateHTTPRouteFromRoutes} />;
      case 'api-key-approvals':
        if (selectedApiDetails) {
          if (selectedApiKey && selectedApiKey.api === selectedApiDetails) {
            return (
              <APIKeyDetailPage
                credential={selectedApiKey}
                breadcrumbSource="api-catalog"
                catalogApiName={selectedApiDetails}
                onNavigateToApiCatalog={() => {
                  setSelectedApiKey(null);
                  setSelectedApiDetails(null);
                  setProductDetailSource(null);
                  setResumeApiDetailsKeysTab(false);
                }}
                onNavigateToParentApi={() => {
                  setSelectedApiKey(null);
                  setResumeApiDetailsKeysTab(true);
                }}
                revealedKeyIds={revealedKeyIds}
                onOpenRevealModal={setRevealModalRowId}
                onOpenEdit={(row) => setEditCredentialId(row.id)}
                onOpenDelete={(row) => setDeleteCredentialId(row.id)}
                onRequestNewApiKey={openRequestModalFromCatalogKeyDetail}
                requestSubmitSuccessAlert={keyDetailRequestSuccessAlert}
                onDismissRequestSubmitSuccessAlert={dismissKeyDetailRequestSuccessAlert}
              />
            );
          }
          return (
            <APIDetailsPage
              apiName={selectedApiDetails}
              onBack={() => {
                setSelectedApiDetails(null);
                setProductDetailSource(null);
                setResumeApiDetailsKeysTab(false);
              }}
              breadcrumbParent="Toki approval"
              onRequestApiKey={
                productDetailSource === 'my-toki'
                  ? openRequestModalFromCatalogApiDetails
                  : openRequestModalFromApproval
              }
              apiKeysRows={credentialsList.filter((c) => c.api === selectedApiDetails)}
              onOpenEdit={(row) => setEditCredentialId(row.id)}
              onOpenDelete={(row) => setDeleteCredentialId(row.id)}
              onOpenApiKeyDetail={(row) => {
                setResumeApiDetailsKeysTab(true);
                setSelectedApiKey(row);
              }}
              resumeApiKeysTab={resumeApiDetailsKeysTab}
              onResumeApiKeysTabConsumed={consumeResumeApiDetailsKeysTab}
            />
          );
        }
        return <APIKeyApprovalsPage onNavigateToApiCatalog={navigateToApiCatalogFromApproval} />;
      case 'api-access':
        if (selectedApiKey) {
        return (
          <APIKeyDetailPage
              credential={selectedApiKey}
              onBack={() => setSelectedApiKey(null)}
              revealedKeyIds={revealedKeyIds}
              onOpenRevealModal={setRevealModalRowId}
              onOpenEdit={(row) => setEditCredentialId(row.id)}
              onOpenDelete={(row) => setDeleteCredentialId(row.id)}
              onRequestNewApiKey={openRequestModalFromKeyDetail}
              requestSubmitSuccessAlert={keyDetailRequestSuccessAlert}
              onDismissRequestSubmitSuccessAlert={dismissKeyDetailRequestSuccessAlert}
            />
          );
        }
        return (
          <APICredentialsPage
            credentialsData={credentialsList}
            onApiKeyNameClick={setSelectedApiKey}
            revealedKeyIds={revealedKeyIds}
            onOpenRevealModal={setRevealModalRowId}
            onOpenEdit={(row) => setEditCredentialId(row.id)}
            onOpenDelete={(row) => setDeleteCredentialId(row.id)}
            onOpenRequestApiKey={openRequestFromMyKeysList}
            onNavigateToApiCatalog={navigateToApiCatalogDetail}
          />
        );
      default:
        return <APIKeyApprovalsPage onNavigateToApiCatalog={navigateToApiCatalogFromApproval} />;
    }
  };

  const showRequestKeySuccessToast = Boolean(
    requestKeySuccessToast &&
      ((activeItem === 'api-access' && !selectedApiKey) ||
        (activeItem === 'api-key-approvals' && selectedApiDetails))
  );

  const showEditKeySuccessToast = Boolean(
    editKeySuccessToast &&
      (activeItem === 'api-access' ||
        (activeItem === 'api-key-approvals' && selectedApiDetails))
  );

  const showDeleteKeySuccessToast = Boolean(
    deleteKeySuccessToast &&
      (activeItem === 'api-access' ||
        (activeItem === 'api-key-approvals' && selectedApiDetails))
  );

  return (
    <Page masthead={masthead} sidebar={sidebar} isContentFilled>
      {renderContent()}
      {showRequestKeySuccessToast && requestKeySuccessToast && (
        <RequestApiKeySuccessToast
          api={requestKeySuccessToast.api}
          keyName={requestKeySuccessToast.keyName}
          onClose={dismissRequestKeyToast}
          onViewDetails={handleRequestSuccessViewDetails}
        />
      )}
      {showEditKeySuccessToast && editKeySuccessToast && (
        <APIKeyUpdatedToast
          api={editKeySuccessToast.api}
          keyName={editKeySuccessToast.keyName}
          updates={editKeySuccessToast.updates}
          onClose={dismissEditKeyToast}
          onViewDetails={handleEditSuccessViewDetails}
        />
      )}
      {showDeleteKeySuccessToast && deleteKeySuccessToast && (
        <APIKeyDeletedToast
          api={deleteKeySuccessToast.api}
          keyName={deleteKeySuccessToast.keyName}
          onClose={dismissDeleteKeyToast}
        />
      )}
      <RevealApiKeyModal
        rowId={revealModalRowId}
        onClose={() => setRevealModalRowId(null)}
        onRevealed={(id) => setRevealedKeyIds((prev) => new Set(prev).add(id))}
      />
      <EditApiKeyModal
        credential={editingCredential}
        isOpen={Boolean(editCredentialId && editingCredential)}
        onClose={() => setEditCredentialId(null)}
        onSave={handleEditApiKeySave}
      />
      <DeleteApiKeyModal
        credential={deletingCredential}
        isOpen={Boolean(deleteCredentialId && deletingCredential)}
        onClose={() => setDeleteCredentialId(null)}
        onConfirm={handleDeleteApiKeyConfirm}
      />
      <RequestApiKeyModal
        isOpen={requestApiKeyOpen}
        onClose={closeRequestApiKeyModal}
        onSubmit={handleRequestApiKeySubmit}
        existingKeyNames={credentialNamesForRequestModal}
      />
    </Page>
  );
};

export default App; 