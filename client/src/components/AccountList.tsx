/* eslint-disable @typescript-eslint/no-explicit-any */

import { AlertCircleIcon, CheckCircleIcon, PlusIcon, UnplugIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface AccountListProps {
  accounts: any[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({ accounts, onDisconnect }: AccountListProps) => {
  const handleDisconnect = async (accountId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to disconnect this account?",
    );
    if (!confirm) return;
    await onDisconnect(accountId);
  };


  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 px-6">
        <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
          <PlusIcon className="size-6 text-slate-500 opacity-50" />
        </div>
        <p className="text-slate-700 text-lg font-medium">No account connected</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">
          Connect your first social platform to start scheduling and automating your content.
        </p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map((account, index) => {
        const meta = PLATFORMS.find((p) => p.id === account.platform);
        if (!meta) return null;

        return (
          <div
            key={account.id || index}
            className="group bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                <meta.icon className="size-6 text-slate-500" />
              </div>

              <div className="min-w-0">
                <div className="text-slate-900 truncate font-medium">{account.handle}</div>
                <div className="text-sm text-slate-500 mt-0.5">{meta.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                {account.status === "connected" ? (
                  <>
                    <CheckCircleIcon className="size-4 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircleIcon className="size-4 text-amber-600" />
                    <span className="text-xs text-amber-600 font-medium">Disconnected</span>
                  </>
                )}
              </div>

              <button
                onClick={() => handleDisconnect(account._id)}
                title="Disconnect account"
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 transition-all"
              >
                <UnplugIcon className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;