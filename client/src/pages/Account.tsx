/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";
import toast from "react-hot-toast";
import api from "../api/axios";

function Account() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
    try {
      if (isSync) {
        const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
        toast.loading(`Syncing ${label} account...`, { id: "sync" });
        
        // Step 1: Force sync with backend
        await api.get("/api/oauth/sync");
        toast.success(successMsg || "Accounts synced!", { id: "sync" });
      }

      // Step 2: Cache-busting timestamp to bypass 304 browser caching
      const { data } = await api.get(`/api/accounts?t=${Date.now()}`);
      
      const accountsList = Array.isArray(data) ? data : data.accounts || [];
      setAccounts(accountsList);

    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || "Failed to load accounts");
    }
  };

  useEffect(() => {
    // 1. Extract params FIRST before modifying URL
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUsername = params.get("username");
    const syncNeeded = params.get("sync") === "true";
    const errorMsg = params.get("error");

    const handleInitialLoad = async () => {
      if (connectedPlatform) {
        // Clear params AFTER capturing them
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
        const handle = connectedUsername ? `(@${connectedUsername})` : "";
        await fetchAccounts(true, connectedPlatform, `${label} ${handle} connected!`);
      } else if (errorMsg) {
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`);
        await fetchAccounts(false);
      } else if (syncNeeded) {
        window.history.replaceState({}, document.title, window.location.pathname);
        await fetchAccounts(true, null, "Account synced!");
      } else {
        await fetchAccounts(false);
      }
    };

    handleInitialLoad();
  }, []);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);

    try {
      const { data } = await api.get(`/api/oauth/${platformId}/url`);
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || `Failed to connect ${platformId}`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`);
      toast.success("Account disconnected");
      await fetchAccounts(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message || `Failed to disconnect`);
    }
  };

  const connectedIds = accounts.map((a) => a.platform);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Connected Accounts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        <button
          onClick={() => setShowPlatformPicker(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center"
        >
          <PlusIcon className="size-4" /> Connect Account
        </button>
      </div>

      {showPlatformPicker && (
        <PlatformPickerModel
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
    </div>
  );
}

export default Account;